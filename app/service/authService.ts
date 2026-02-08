import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";
import api from "@/lib/axios";

export const authService = {
    login: async (payload: LoginRequest) => {
        const res = await api.post<AuthResponse>('/auth/login', payload);
        localStorage.setItem('accessToken', res.data.accessToken)
        return res.data;
    },
    register: async (payload: RegisterRequest) => {
        const res = await api.post<User>('/auth/register', payload);
        return res.data;
    },
    getProfile: async () => {
        const res = await api.get<User>('/auth/profile');
        return res.data;
    }
}
