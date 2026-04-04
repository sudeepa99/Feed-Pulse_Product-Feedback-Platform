"use client";

import FeedbackForm from "@/app/components/feedback-form";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener("auth-changed", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-changed", callback);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("token");
}

function getServerSnapshot() {
  return undefined;
}

export default function HomePage() {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasVisited = sessionStorage.getItem("visited_home");

    if (token && !hasVisited) {
      sessionStorage.setItem("visited_home", "true");
      router.replace("/dashboard");
    }
  }, [token, router]);

  if (token === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <p className="text-sm text-slate-300">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
              FeedPulse
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              AI-powered feedback for better product decisions
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
              Collect feature requests, bugs, and improvements in one place. Let
              AI categorize, summarize, and score what matters most.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-8">
            <FeedbackForm />
          </div>
        </div>
      </section>
    </main>
  );
}
