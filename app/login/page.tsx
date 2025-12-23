"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Call NextAuth (which calls your Express Backend)
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false, // We handle redirect manually to show errors
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/"); // Redirect to protected page
      router.refresh();
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center text-gray-900">Login</h2>

        {message && (
          <p className="text-green-600 text-sm mb-4 text-center font-medium bg-green-50 p-2 rounded-lg">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 transition-all bg-gray-50 text-gray-700"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 transition-all bg-gray-50 text-gray-700"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-[#FFC629] text-gray-900 font-bold p-4 rounded-xl hover:bg-[#E5B225] transition-colors shadow-[0_4px_14px_rgb(255,198,41,0.4)]"
          >
            Sign in with Email
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 p-4 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all font-semibold text-gray-700"
        >
          <Image src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black font-bold hover:underline decoration-[#FFC629] decoration-2 underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
    </Suspense>
  );
}