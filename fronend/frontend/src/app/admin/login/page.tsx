"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid admin credentials");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-400">
          Access the feedback dashboard
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-xl bg-slate-900 px-4 py-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
            Login
          </button>
        </div>
      </form>
    </main>
  );
}
