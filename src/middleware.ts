import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Edge middleware: gate every page on a logged-in session.
 *
 * - Anonymous user requests a protected page → redirect to /login
 * - Logged-in user requests /login → redirect to /
 *
 * Server components in the (app) route group also call `auth()` themselves
 * for defence-in-depth, since the matcher excludes a few paths.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  const isPublicAuthPath = path.startsWith("/api/auth") || path === "/login";

  if (!isLoggedIn && !isPublicAuthPath) {
    const redirectUrl = new URL("/login", req.url);
    if (path !== "/") redirectUrl.searchParams.set("from", path);
    return Response.redirect(redirectUrl);
  }

  if (isLoggedIn && path === "/login") {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  // Skip Next internals + static assets. Note we do match /api routes
  // that are NOT /api/auth so future API endpoints get gated too.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
