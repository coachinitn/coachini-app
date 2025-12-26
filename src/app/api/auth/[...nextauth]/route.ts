import NextAuth from "next-auth";
import { authOptions } from "@/core/auth/auth-options";

/**
 * NextAuth.js API route handler
 * Handles all authentication-related API routes
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
