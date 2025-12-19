import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decrypt, encrypt } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not configured')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

async function refreshTokenIfNeeded(
  supabase: any,
  connection: any
): Promise<string> {
  const now = new Date()
  const expiresAt = new Date(connection.token_expires_at)
  
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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const supabase = getSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { itemId, provider = 'bitwarden' } = await request.json()
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }
    
    const { data: connection, error: connError } = await supabase
      .from('credential_provider_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single()
    
    if (connError || !connection) {
      return NextResponse.json(
        { error: 'No Bitwarden connection found' },
        { status: 404 }
      )
    }
    
    const accessToken = await refreshTokenIfNeeded(supabase, connection)
    
    const itemResponse = await fetch(`https://api.bitwarden.com/object/item/${itemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    
    if (!itemResponse.ok) {
      console.error('Bitwarden item error:', await itemResponse.text())
      return NextResponse.json(
        { error: 'Failed to fetch item from Bitwarden' },
        { status: 500 }
      )
    }
    
    const itemData = await itemResponse.json()
    const item = itemData.data
    
    console.log(`[AUDIT] User ${user.id} revealed credentials for item ${itemId} at ${new Date().toISOString()}`)
    
    return NextResponse.json({
      id: item.id,
      name: item.name,
      username: item.login?.username || null,
      password: item.login?.password || null,
      url: item.login?.uris?.[0]?.uri || null,
      notes: item.notes || null,
      expiresInSeconds: 30,
    })
    
  } catch (error) {
    console.error('Reveal credential error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
