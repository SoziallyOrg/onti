// Auth.js route handlers — exposes /api/auth/* endpoints
// (callback, csrf, session, signin, signout, etc.).
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
