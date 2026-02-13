import { signIn, signOut as nextAuthSignOut } from "next-auth/react";
import type { Session } from "next-auth";

export async function signInWithGoogle(callbackUrl: string = "/") {
  try {
    await signIn("google", {
      callbackUrl,
      redirect: true,
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export async function signOut(callbackUrl: string = "/login") {
  try {
      await nextAuthSignOut({
      callbackUrl,
      redirect: true,
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export function getBackendToken(session: Session | null): string | null {
  return session?.accessToken || null;
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  session: Session | null
): Promise<Response> {
  const token = getBackendToken(session);

  if(!token){
    throw new Error ("No access token available, User Might Be Logged Out");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401 ){
    console.warn("Token expired or invalid. Redirecting to login.");
    window.location.href = "/login";
  }
  return response;
}
