"use client";

import Link from "next/link";
import { MessageSquareText, LayoutDashboard } from "lucide-react";

export default function Navbar() {
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
          <Link
            href="/admin/login"
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            <LayoutDashboard size={16} />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
