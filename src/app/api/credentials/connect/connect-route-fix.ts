import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { encrypt } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not configured')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientSecret, provider = 'bitwarden' } = await request.json()
    
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
    
    // Determine scope based on client_id format
    // Organization keys start with "organization.", personal keys start with "user."
    const isOrganization = clientId.startsWith('organization.')
    const scope = isOrganization ? 'api.organization' : 'api'
    
    console.log(`Attempting Bitwarden auth with scope: ${scope}, clientId prefix: ${clientId.substring(0, 15)}...`)
    
    const tokenResponse = await fetch('https://identity.bitwarden.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Bitwarden auth error:', errorData)
      return NextResponse.json(
        { error: 'Invalid Bitwarden credentials. Please check your Client ID and Client Secret.' },
        { status: 400 }
      )
    }
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const expiresIn = tokenData.expires_in || 3600
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()
    
    const clientIdEncrypted = encrypt(clientId)
    const clientSecretEncrypted = encrypt(clientSecret)
    const accessTokenEncrypted = encrypt(accessToken)
    
    const { data, error } = await supabase
      .from('credential_provider_connections')
      .upsert({
        user_id: user.id,
        provider,
        client_id_encrypted: clientIdEncrypted,
        client_secret_encrypted: clientSecretEncrypted,
        access_token_encrypted: accessTokenEncrypted,
        token_expires_at: tokenExpiresAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save connection' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Bitwarden connected successfully',
      connection: {
        id: data.id,
        provider: data.provider,
        connected_at: data.created_at,
      }
    })
    
  } catch (error) {
    console.error('Connect error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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
    
    const { data: connections, error } = await supabase
      .from('credential_provider_connections')
      .select('id, provider, created_at, updated_at')
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
    }
    
    return NextResponse.json({ connections })
    
  } catch (error) {
    console.error('Get connections error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
