"use client";
import { useUserProfile } from "../hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useUserProfile();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading)
    return <div className="p-10 text-zinc-500">Loading profile...</div>;
  if (isError || !user)
    return <div className="p-10 text-red-500">Failed to load profile.</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 pt-25">
      <Navbar />
      <div className="mb-8 border-b border-zinc-100 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your account information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Kolom Kiri: Avatar & Role */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-zinc-50 bg-zinc-100 shadow-sm flex items-center justify-center">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-zinc-400">
                  {getInitials(user.name)}
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">{user.name}</h2>
            <span className="mt-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {user.role}
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Detail User */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-zinc-900">
              Personal Information
            </h3>
            <dl className="space-y-4 divide-y divide-zinc-100">
              <div className="pt-4 first:pt-0">
                <dt className="text-sm font-medium text-zinc-500">Full Name</dt>
                <dd className="mt-1 text-sm text-zinc-900">{user.name}</dd>
              </div>
              <div className="pt-4">
                <dt className="text-sm font-medium text-zinc-500">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">{user.email}</dd>
              </div>
              <div className="pt-4">
                <dt className="text-sm font-medium text-zinc-500">
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {user.phone || "-"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex gap-4">
              <Link
                href="/orders"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                View Orders History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
