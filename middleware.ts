import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware();
export const config = {
  matcher: [
    '/api/:path',
    '/((?!_next/static|_next/image|favicon.ico|.\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};