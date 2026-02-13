import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomUser extends NextAuthUser {
  id: number | string; 
  role: string;
  emailVerified?: Date | null; 
}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string; 
    error?: string;
  }


  interface User {
    id: number | string;
    role: string;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    id: number;
    role: string;
    backendAccessToken?: string; 
    backendRefreshToken?: string; 
    expiresAt?: number;           
    error?: string;
  }
}


declare module "@auth/core/adapters" {
  interface AdapterUser extends CustomUser {
    id: number | string; 
  }
}