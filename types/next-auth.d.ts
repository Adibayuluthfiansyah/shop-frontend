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
      id: number | string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } &  DefaultSession["user"];
    accessToken?: string; 
    error?: string;
  }


  interface User {
    id: number | string;
    role: string;
    emailVerified?: Date | null;
    accessToken?: string;  
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    id: number | string;
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