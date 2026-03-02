import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_ORIGIN,
});

export const { signIn, signUp, signOut, useSession } = authClient;
