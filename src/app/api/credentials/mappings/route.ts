import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    
    const { 
      connectionId, 
      providerItemId, 
      providerItemName,
      providerItemUrl,
      assetType, 
      assetId 
    } = await request.json()
    
    if (!connectionId || !providerItemId || !assetType || !assetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const { data: connection } = await supabase
      .from('credential_provider_connections')
      .select('id')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .single()
    
    if (!connection) {
      return NextResponse.json({ error: 'Invalid connection' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('credential_asset_mappings')
      .upsert({
        user_id: user.id,
        connection_id: connectionId,
        provider_item_id: providerItemId,
        provider_item_name: providerItemName,
        provider_item_url: providerItemUrl,
        asset_type: assetType,
        asset_id: assetId,
      }, {
        onConflict: 'connection_id,provider_item_id,asset_type,asset_id',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Create mapping error:', error)
      return NextResponse.json({ error: 'Failed to create mapping' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, mapping: data })
    
  } catch (error) {
    console.error('Mapping error:', error)
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
    
    const { searchParams } = new URL(request.url)
    const assetType = searchParams.get('assetType')
    const assetId = searchParams.get('assetId')
    
    let query = supabase
      .from('credential_asset_mappings')
      .select('*')
      .eq('user_id', user.id)
    
    if (assetType) {
      query = query.eq('asset_type', assetType)
    }
    if (assetId) {
      query = query.eq('asset_id', assetId)
    }
    
    const { data: mappings, error } = await query
    
    if (error) {
      console.error('Get mappings error:', error)
      return NextResponse.json({ error: 'Failed to fetch mappings' }, { status: 500 })
    }
    
    return NextResponse.json({ mappings })
    
  } catch (error) {
    console.error('Get mappings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url)
    const mappingId = searchParams.get('id')
    
    if (!mappingId) {
      return NextResponse.json({ error: 'Mapping ID is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('credential_asset_mappings')
      .delete()
      .eq('id', mappingId)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Delete mapping error:', error)
      return NextResponse.json({ error: 'Failed to delete mapping' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete mapping error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
