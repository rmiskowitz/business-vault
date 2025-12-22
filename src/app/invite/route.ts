// ============================================================================
// Business Vault: Invite Reviewer API Route
// app/api/invite/route.ts
// ============================================================================

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, name, role = 'reviewer', message } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address required' },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const { data: existing } = await supabase
      .from('vault_access')
      .select('id, status')
      .eq('owner_id', user.id)
      .eq('reviewer_email', email.toLowerCase())
      .single();

    if (existing && existing.status !== 'revoked') {
      return NextResponse.json(
        { success: false, error: 'An invitation for this email already exists' },
        { status: 400 }
      );
    }

    // Create or update invitation
    let inviteToken: string;
    
    if (existing) {
      // Reactivate revoked invitation
      const { data, error } = await supabase
        .from('vault_access')
        .update({
          status: 'pending',
          reviewer_name: name || null,
          role: role,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          invite_token: crypto.randomUUID(),
        })
        .eq('id', existing.id)
        .select('invite_token')
        .single();

      if (error) throw error;
      inviteToken = data.invite_token;
    } else {
      // Create new invitation
      const { data, error } = await supabase
        .from('vault_access')
        .insert({
          owner_id: user.id,
          owner_email: user.email,
          reviewer_email: email.toLowerCase(),
          reviewer_name: name || null,
          role: role,
          status: 'pending',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select('invite_token')
        .single();

      if (error) throw error;
      inviteToken = data.invite_token;
    }

    // TODO: Send email invitation
    // For now, we just log the invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://businessvault.io'}/accept-invite?token=${inviteToken}`;
    console.log('Invite link:', inviteLink);

    // In production, integrate with email service:
    // await sendEmail({
    //   to: email,
    //   subject: `${user.email} has invited you to review their Business Vault`,
    //   template: 'vault-invite',
    //   data: {
    //     ownerEmail: user.email,
    //     inviteLink,
    //     role,
    //     message,
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Invitation created successfully',
      // Don't expose invite_token in production - only for development
      ...(process.env.NODE_ENV === 'development' && { inviteLink }),
    });

  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET - Verify invite token
// ============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: invite, error } = await supabase
      .from('vault_access')
      .select('id, owner_email, role, status, expires_at')
      .eq('invite_token', token)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    // Check if already used
    if (invite.status === 'active') {
      return NextResponse.json(
        { success: false, error: 'Invitation already accepted' },
        { status: 400 }
      );
    }

    if (invite.status === 'revoked') {
      return NextResponse.json(
        { success: false, error: 'Invitation has been revoked' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      invite: {
        ownerEmail: invite.owner_email,
        role: invite.role,
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify invitation' },
      { status: 500 }
    );
  }
}