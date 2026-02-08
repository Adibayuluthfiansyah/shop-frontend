export interface User {
  id: number;
  email: string;
  name: string;
  phone?:string;
  role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}