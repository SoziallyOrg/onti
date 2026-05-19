/**
 * Module augmentation: add our domain fields to the Auth.js session/user.
 *
 * Auth.js v5 re-exports JWT from `@auth/core/jwt` via `next-auth/jwt`,
 * so we augment both module paths to make sure `tsc` sees `role` on
 * `JWT` regardless of which path callers import from.
 */
import type { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "MECHANIC";

declare module "next-auth" {
  interface User {
    id: string;
    role: AppRole;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AppRole;
  }
}
