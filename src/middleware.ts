import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('admin_token');
    
    // For development, allow access without authentication
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    
    // In production, check for valid auth token
    if (!authToken || !isValidToken(authToken.value)) {
      // Redirect to login page (would need to be implemented)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

function isValidToken(token: string): boolean {
  // Simplified token validation - in production use proper JWT validation
  return token === process.env.ADMIN_JWT_SECRET;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};