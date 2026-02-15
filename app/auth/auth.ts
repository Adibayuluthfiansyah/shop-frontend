import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// Backend API URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.backendRefreshToken}`,
      }
    })
    const refreshedTokens = await response.json()
    if (!response.ok) {
      throw refreshedTokens;
    }
    return {
      ...token,
      backendAccessToken: refreshedTokens.access_token,
      backendRefreshToken: refreshedTokens.refresh_token ?? token.backendRefreshToken, 
      expiresAt: Date.now() + 15 * 60 * 1000, 
      error: undefined,
    }
  } catch (error) {
      console.error("Error Refreshing Access Token:", error);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      }
  }
}

export const {handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),

   Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          
          const data = await res.json();

          if (res.ok && data) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              image: data.user.image, 
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login Credentials Error:", error);
          return null;
        }
      }
    })
  ],
  session: {strategy: "jwt"},
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // if login google
        if (account.provider === "google") {
          try {
            // send to backend
            const response = await fetch(`${BACKEND_API_URL}/auth/google-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                image: user.image,
                emailVerified: true,
              }),
            });
            
            const backendData = await response.json();
            
            if (!response.ok) throw new Error('Backend authentication failed');

            // save data to token
            token.backendAccessToken = backendData.access_token;
            token.backendRefreshToken = backendData.refresh_token;
            token.role = backendData.user.role;
            token.id = backendData.user.id;
            token.picture = backendData.user.image;
            token.expiresAt = Date.now() + 15 * 60 * 1000; 

            return token;
          } catch (error) {
            console.error("Error calling backend Google login:", error);
            return token;
          }
        }
        
        // if login creadentials
        if (account.provider === "credentials") {
          token.id = user.id;
          token.role = user.role;
          token.picture = user.image;
          token.backendAccessToken = user.accessToken;
          token.backendRefreshToken = user.refreshToken;
          token.expiresAt = Date.now() + 15 * 60 * 1000;
          
          return token;
        }
      }

      // if token not expired
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // if expired
      console.log("Token expired, refreshing...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string | number,
          role: token.role as string,
          image: token.picture as string | null, 
        },
        accessToken: token.backendAccessToken as string,
        error: token.error, 
      };
    },
  },

  pages: {
    signIn: '/login',
    error: '/login', 
  },
});
