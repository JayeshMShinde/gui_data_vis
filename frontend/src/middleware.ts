import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/landing', '/']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/landing', req.url));
  }
  
  // Redirect unauthenticated users from root to landing
  if (req.nextUrl.pathname === '/' && !userId) {
    return NextResponse.redirect(new URL('/landing', req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};