import type { NextAuthConfig } from "next-auth";

// Type augmentations for next-auth's User / Session / JWT live in
// `./types/next-auth.d.ts` and are picked up automatically by tsc via
// the tsconfig `include` glob. Don't try to side-effect-import them at
// runtime — webpack can't resolve a pure `.d.ts` file.

type AppRole = "ADMIN" | "MECHANIC";

/**
 * Edge-safe Auth.js config.
 *
 * Used by `src/middleware.ts` (which runs on the edge runtime) so it can
 * decide whether to redirect to /login. It deliberately does NOT include
 * the Credentials provider's `authorize` callback because that needs
 * Prisma + bcrypt, neither of which work on the edge.
 *
 * The full config (with `authorize`) is in `src/auth.ts`.
 */
export const authConfig = {
  // We run behind Caddy on a known host in production. Auth.js's host
  // header validation would otherwise reject every request that doesn't
  // originate from a list of "trusted" hosts. Caddy already enforces the
  // hostname → certificate binding, so this is safe.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [], // populated in src/auth.ts
  callbacks: {
    /**
     * Surface role + id on the session so server components can do
     * `if (session.user.role === "ADMIN")` cheaply.
     */
    jwt({ token, user }) {
      // `user` is a `User | AdapterUser` union. Only User has our `role`.
      // We don't use a database adapter so the AdapterUser branch never
      // happens at runtime, but TS can't narrow that for us so we cast.
      if (user) {
        token.role = (user as { role: AppRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        if (token.role) {
          session.user.role = token.role as AppRole;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    // 30 days — workshop tablets are shared but the login pain isn't
    // worth a tighter window for an internal app with 3 users.
    maxAge: 60 * 60 * 24 * 30,
  },
} satisfies NextAuthConfig;
