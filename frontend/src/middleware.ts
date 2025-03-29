import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isRegisterPage = request.nextUrl.pathname === '/auth/register';
  const isVerifyPage = request.nextUrl.pathname === '/auth/verify';
  const isVerifyEmailPage = request.nextUrl.pathname.startsWith('/auth/verify-email');
  const isSignInPage = request.nextUrl.pathname === '/auth/signin';

  // Allow access to register and verify pages without any redirection
  if (isRegisterPage || isVerifyPage || isVerifyEmailPage) {
    return NextResponse.next();
  }

  // If no token and trying to access protected routes, redirect to login
  if (!token && (isDashboardPage || isOnboardingPage)) {
    const url = new URL('/auth/signin', request.url);
    return NextResponse.redirect(url);
  }

  // If has token and trying to access signin page, redirect to dashboard
  if (token && isSignInPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If authenticated, check onboarding status for dashboard access
  if (token && (isDashboardPage || isOnboardingPage)) {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/me/', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      const userData = await response.json();

      // If onboarding not completed and not on onboarding page, redirect to onboarding
      if (!userData.has_completed_onboarding && !isOnboardingPage) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }

      // If onboarding completed and on onboarding page, redirect to dashboard
      if (userData.has_completed_onboarding && isOnboardingPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If there's an error fetching user data, clear the token and redirect to login
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/signin',
    '/auth/register',
    '/auth/verify',
    '/auth/verify-email/:path*',
    '/onboarding/:path*'
  ],
}; 