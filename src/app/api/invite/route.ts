import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    // For API routes, we need to create a new client
    // Note: This is a simplified version - in production you'd want proper auth
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const body = await request.json()
    const { email, name, role = 'reviewer', owner_id, owner_email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address required' },
        { status: 400 }
      )
    }

    if (!owner_id) {
      return NextResponse.json(
        { success: false, error: 'Owner ID required' },
        { status: 400 }
      )
    }

    // Create invitation
    const { data, error } = await supabase
      .from('vault_access')
      .insert({
        owner_id,
        owner_email,
        reviewer_email: email.toLowerCase(),
        reviewer_name: name || null,
        role,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('invite_token')
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create invitation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation created successfully',
    })

  } catch (error) {
    console.error('Invite error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create invitation' },
      { status: 500 }
    )
  }
}