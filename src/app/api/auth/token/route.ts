import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Token grabber API endpoint
 * Returns the current user's access token for realtime connections
 * Uses getToken to access server-side JWT tokens that are not exposed to client
 */
export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from NextAuth (server-side only)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }



    return NextResponse.json({
      userId: token.id || token.sub || token.email,
      accessToken: token.accessToken || `temp_token_${token.id}`,
      refreshToken: token.refreshToken,
      sessionId: token.id || token.sub,
      email: token.email,
      name: token.name,
      username: token.username,
      roles: token.roles,
      permissions: token.permissions,
    });

  } catch (error) {
    console.error('Token grabber error:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
