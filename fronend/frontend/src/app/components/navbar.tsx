"use client";

import Link from "next/link";
import { MessageSquareText, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    syncAuth();

    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-cyan-500 p-2 text-slate-950">
            <MessageSquareText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">FeedPulse</p>
            <p className="text-xs text-slate-400">AI Feedback Platform</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
          >
            Submit Feedback
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
