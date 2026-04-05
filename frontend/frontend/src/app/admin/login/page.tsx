"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import API from "@/app/lib/api";

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
  };
  message: string;
  error: string | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await API.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.message || "Invalid admin credentials");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-400">
          Access the feedback dashboard
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
}
