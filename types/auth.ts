export interface User {
  id: number;
  email: string;
  name: string;
  phone?:string;
  role: 'ADMIN' | 'USER' | 'SELLER';
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}