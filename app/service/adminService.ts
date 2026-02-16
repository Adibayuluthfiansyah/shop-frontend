import api from "@/lib/axios";
import { User } from "@/types/auth";
import { PaginatedResponse } from "@/types/api";


export const adminService = {
  // TODO: Backend belum ada endpoint ini
  getAllUsers: async (page = 1, limit = 10) => {
    const res = await api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
    return res.data;
  },
  
  // TODO: Backend belum ada endpoint ini
  updateUserRole: async (userId: number, role: 'ADMIN' | 'USER' | 'SELLER') => {
    const res = await api.patch(`/users/${userId}/role`, { role });
    return res.data;
  },
  
  // TODO: Backend belum ada endpoint ini
  deleteUser: async (userId: number) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  }
};