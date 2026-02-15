"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Register Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-black p-4 lg:p-6">
      <div className="hidden lg:flex lg:w-1/2 relative rounded-3xl overflow-hidden bg-zinc-900">
        <Image
          src="/model.jpeg"
          alt="Register Hero"
          fill
          className="object-cover"
          priority
        />
        {/* gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 text-white">
          <div>
            <span className="font-bold text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.35em] text-white">
              MINI
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
              Start Your Journey
            </h2>
            <p className="text-lg text-gray-200 font-medium drop-shadow-md">
              Join thousands of happy shoppers today.
            </p>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-black tracking-widest text-white uppercase">
              MINI
            </span>
          </div>

          <div className="text-left mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Sign up to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                required
                disabled={isLoading}
              />
            </div>

            {/* email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                required
                disabled={isLoading}
              />
            </div>

            {/* phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                required
                disabled={isLoading}
              />
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* confirm password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-full transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* login */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
