import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { authService } from "../service/authService";
import {LoginRequest, RegisterRequest, AuthResponse, User} from "@/types/auth";
import { useRouter } from "next/router";
import {toast} from "sonner";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation <AuthResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
        mutationFn: (payload) => authService.login(payload),
        onSuccess: (data) => {
            toast.success(data.message || 'Login Berhasil');
            queryClient.invalidateQueries({queryKey: ['userProfile']});
            router.push('/');
        },
        onError: (error) => {
            const msg = error.response?.data?.message || 'Login Failed';
            toast.error(Array.isArray(msg) ? msg[0] : msg || "Gagal Login");
        },
    });
}

export const useRegister = () => {
    const router = useRouter();

    return useMutation <User, AxiosError<ApiErrorResponse>, RegisterRequest>({
        mutationFn: (payload) => authService.register(payload),
        onSuccess: () => {
            toast.success('Registration successful');
            router.push('/login');
        },
        onError: (error) => {
            const responseData = error.response?.data;
            const msg = responseData?.message;
            toast.error(Array.isArray(msg) ? msg[0] : (msg || "Gagal Register"));
        }
    })
}

export const useUserProfile = () => {
    return useQuery<User, AxiosError<ApiErrorResponse>>({
        queryKey: ['userProfile'],
        queryFn: authService.getProfile,
        retry: 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useLogout = () => {
    return () => authService.logout();
}