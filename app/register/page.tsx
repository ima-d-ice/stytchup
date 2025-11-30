"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Send data to Express Backend
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // 2. If successful, redirect to login
      router.push("/login?message=Registered successfully! Please login.");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center text-gray-900">Create Account</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 transition-all bg-gray-50 text-gray-700"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <button type="submit" className="w-full bg-[#FFC629] text-gray-900 font-bold p-4 rounded-xl hover:bg-[#E5B225] transition-colors shadow-[0_4px_14px_rgb(255,198,41,0.4)]">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-black font-bold hover:underline decoration-[#FFC629] decoration-2 underline-offset-2">Login</Link>
        </p>
      </div>
    </div>
  );
}