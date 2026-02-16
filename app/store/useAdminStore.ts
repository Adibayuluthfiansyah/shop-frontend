import { create } from "zustand";
import { User} from "@/types/auth";
import { PaginationMeta } from "@/types/api";
interface AdminState {
  users: User[];
  meta: PaginationMeta | null;
  setUsersData: (users: User[], meta: PaginationMeta) => void;
  updateUserRole: (userId: number, role: 'ADMIN' | 'USER' | 'SELLER') => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  meta: null,
  setUsersData: (users, meta) => set({ users, meta }),
  updateUserRole: (userId, role) => set((state) => ({
    users: state.users.map(u => u.id === userId ? { ...u, role } : u)
  }))
}));