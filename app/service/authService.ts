import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";
import api from "@/lib/axios";

export const authService = {
    login: async (payload: LoginRequest): Promise <AuthResponse> => {
        const res = await api.post<AuthResponse>('/auth/login', payload);
        return res.data;
    },
    register: async (payload: RegisterRequest): Promise<User> => {
        const res = await api.post<User>('/auth/register', payload);
        return res.data;
    },
    getProfile: async (): Promise<User> => {
        const res = await api.get<User>('/auth/profile');
        return res.data;
    },
    logout: async () => {
       try {
        await api.post('/auth/logout');
       } catch (error){
        console.error('Logout failed', error);
       } finally{
        window.location.href = '/login';
       }
    }
}
