"use client";

import { useAdminUsers, useAdminMutations } from "@/app/hooks/useAdminAction";
import { User } from "@/types/auth";
import { useState } from "react";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminUsers(page);
  const { updateRole } = useAdminMutations();

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole.mutate({ id: userId, role: newRole as User["role"] });
  };

  if (isLoading)
    return <div className="p-8 text-sm text-zinc-500">Loading users...</div>;
  if (isError)
    return (
      <div className="p-8 text-sm text-red-500">
        Failed to load users. Make sure backend user management endpoints are
        implemented.
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage user access and roles. ({data?.meta.total || 0} total users)
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-100">
          <thead className="bg-zinc-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {data?.data?.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                  {user.name || "Unnamed"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      user.role === "ADMIN"
                        ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                        : user.role === "SELLER"
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                          : "bg-zinc-50 text-zinc-600 ring-zinc-500/10"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updateRole.isPending}
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-black sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="USER">User</option>
                    <option value="SELLER">Seller</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.meta && (
        <div className="mt-6 flex justify-between items-center text-sm">
          <div className="text-zinc-500">
            Showing {data.data.length} of {data.meta.total} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.meta.hasPrev}
              className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-zinc-900 font-medium">
              Page {page} of {data.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.meta.hasNext}
              className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
