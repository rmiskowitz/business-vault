import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decrypt, encrypt } from '@/lib/encryption'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function refreshTokenIfNeeded(
  supabase: any,
  connection: any
): Promise<string> {
  const now = new Date()
  const expiresAt = new Date(connection.token_expires_at)
  
  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    const clientId = decrypt(connection.client_id_encrypted)
    const clientSecret = decrypt(connection.client_secret_encrypted)
    
    const tokenResponse = await fetch('https://identity.bitwarden.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'api',
      }),
    })
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to refresh Bitwarden token')
    }
    
    const tokenData = await tokenResponse.json()
    const newAccessToken = tokenData.access_token
    const expiresIn = tokenData.expires_in || 3600
    const newTokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()
    
    // Update token in database
    await supabase
      .from('credential_provider_connections')
      .update({
        access_token_encrypted: encrypt(newAccessToken),
        token_expires_at: newTokenExpiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', connection.id)
    
    return newAccessToken
  }
  
  return decrypt(connection.access_token_encrypted)
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get provider from query params (default to bitwarden)
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider') || 'bitwarden'
    
    // Get user's connection
    const { data: connection, error: connError } = await supabase
      .from('credential_provider_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single()
    
    if (connError || !connection) {
      return NextResponse.json(
        { error: 'No Bitwarden connection found. Please connect your account first.' },
        { status: 404 }
      )
    }
    
    // Get valid access token (refresh if needed)
    const accessToken = await refreshTokenIfNeeded(supabase, connection)
    
    // Fetch vault items from Bitwarden
    const itemsResponse = await fetch('https://api.bitwarden.com/list/object/items', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    
    if (!itemsResponse.ok) {
      const errorText = await itemsResponse.text()
      console.error('Bitwarden items error:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch items from Bitwarden' },
        { status: 500 }
      )
    }
    
    const itemsData = await itemsResponse.json()
    
    // Get existing mappings for this user
    const { data: mappings } = await supabase
      .from('credential_asset_mappings')
      .select('provider_item_id, asset_type, asset_id')
      .eq('connection_id', connection.id)
    
    const mappingLookup = new Map(
      (mappings || []).map(m => [m.provider_item_id, { asset_type: m.asset_type, asset_id: m.asset_id }])
    )
    
    // Return items with mapping info (but NOT the actual passwords)
    const items = (itemsData.data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type, // 1 = login, 2 = secure note, 3 = card, 4 = identity
      url: item.login?.uris?.[0]?.uri || null,
      username: item.login?.username || null,
      folderId: item.folderId,
      mapping: mappingLookup.get(item.id) || null,
    })).filter((item: any) => item.type === 1) // Only return login items
    
    return NextResponse.json({
      items,
      connection_id: connection.id,
    })
    
  } catch (error) {
    console.error('Fetch items error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
