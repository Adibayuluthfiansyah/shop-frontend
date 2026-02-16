import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/app/service/adminService";
import { useAdminStore } from "@/app/store/useAdminStore";
import { toast } from "sonner";
import { User } from "@/types/auth";


export const useAdminUsers = (page = 1) => {
  const setUsersData = useAdminStore((state) => state.setUsersData);
  
  return useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const data = await adminService.getAllUsers(page);
      setUsersData(data.data, data.meta); 
      return data;
    }
  });
};

export const useAdminMutations = () => {
  const queryClient = useQueryClient();
  const updateRoleStore = useAdminStore((state) => state.updateUserRole);

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: User["role"] }) => 
      adminService.updateUserRole(id, role),
    onSuccess: (_, variables) => { 
      updateRoleStore(variables.id, variables.role);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated successfully");
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : "Failed to update role";
      toast.error(errorMessage);
    }
  });

  return { updateRole };
};