"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import GoogleFillIcon from "@/components/ui/googleIcon";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Login failed. Check your email or password.");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Google sign-in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    // main container
    <div className="min-h-screen flex w-full bg-black p-4 lg:p-6">
      {/* left section */}
      <div className="hidden lg:flex lg:w-1/2 relative rounded-3xl overflow-hidden bg-zinc-900">
        <Image
          src="/model.jpeg"
          alt="Login Hero"
          fill
          className="object-cover"
          priority
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

        {/* content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 text-white">
          {/* logo */}
          <div>
            <span className="font-bold text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.35em] text-white">
              MINI
            </span>
          </div>

          {/* text hero image */}
          <div className="max-w-md">
            <h2 className="text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
              Your Shopping Journey Continues
            </h2>
            <p className="text-lg text-gray-200 font-medium drop-shadow-md">
              Ready to find your perfect fit ?
            </p>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-8">
          {/* header mobile */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-black tracking-widest text-white uppercase">
              MINI
            </span>
          </div>

          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
                required
                disabled={isLoading}
              />
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-full transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* divider */}
          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-zinc-800"></div>
            <span className="shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-widest">
              Or continue with
            </span>
            <div className="grow border-t border-zinc-800"></div>
          </div>

          {/* google section */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-full transition-all border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <GoogleFillIcon size={20} color="currentColor" />
            )}
            <span className="text-sm">Google</span>
          </button>
          <p className="text-center text-zinc-500 text-sm">
            {`Don't have an account ? `}
            <Link
              href="/register"
              className="text-white hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
