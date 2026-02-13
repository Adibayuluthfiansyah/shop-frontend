import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"
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
    })
  ],
  session: {strategy: "jwt"},

  callbacks: {
    async jwt ({
      token,user,account
    }){
      if (account && user) {
        try {
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
          })
          const backendData = await response.json();

          if (!response.ok) throw new Error('Backend authentication failed');
          return {
            ...token,
            backendAccessToken: backendData.access_token, 
            backendRefreshToken: backendData.refresh_token,
            role: backendData.user.role,
            id: backendData.user.id,
            expiresAt: Date.now() + 15 * 60 * 1000, 
          };
        } catch (error){
          console.error("Error calling backend Google login:", error);
          return token;
        }
      }
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      console.log("Token expired, refreshing...");
      return await refreshAccessToken(token);
    },
    
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as number,
          role: token.role as string,
        },
        accessToken: token.backendAccessToken as string,
        error: token.error, 
      };
    },
  },
  
  pages: {
    signIn: '/login',
    }
})

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
// const prisma = globalForPrisma.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma) as Adapter,
  
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//       // Use default profile mapping - PrismaAdapter will handle ID properly
//     }),
//   ],
  
//   session: { strategy: "jwt" },
  
//   callbacks: {
//     async jwt({ token, user, account, profile }) {
//       // First time sign in 
//       if (user && account?.provider === "google") {
//         try {
//           // Call backend API to create/update user and get JWT
//           const response = await fetch(`${BACKEND_API_URL}/auth/google-login`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               email: user.email,
//               name: user.name,
//               googleId: account.providerAccountId, 
//               image: user.image,
//               emailVerified: user.emailVerified,
//             }),
//           });

//           if (!response.ok) {
//             console.error('Backend Google login failed:', await response.text());
//             throw new Error('Failed to authenticate with backend');
//           }

//           const backendData = await response.json();
          
//           // Store backend JWT token and user info in NextAuth token
//           token.backendAccessToken = backendData.accessToken;
//           token.id = backendData.user.id;
//           token.role = backendData.user.role;
//           token.email = backendData.user.email;
//           token.name = backendData.user.name;
//           token.picture = backendData.user.image;
          
//           console.log('Backend JWT obtained successfully');
//         } catch (error) {
//           console.error(' Error calling backend Google login:', error);
//         }
//       }
      
//       return token;
//     },
    
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id as number,
//           role: token.role as string,
//         },
//         backendAccessToken: token.backendAccessToken,
//       };
//     },
//   },
  
//   pages: {
//     signIn: '/login',
//     error: '/login',
//   },
// })