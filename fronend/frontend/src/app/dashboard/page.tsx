"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import API from "@/app/lib/api";
import DashboardTable from "@/app/components/dashboard-table";
import FeedbackCard from "@/app/components/feedback-card";
import StatsBar from "@/app/components/stats-bar";

type Feedback = {
  _id: string;
  title: string;
  category: string;
  status: string;
  ai_sentiment?: string;
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  createdAt: string;
};

type FeedbackResponse = {
  success: boolean;
  data: {
    items: Feedback[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
  error: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [items, setItems] = useState<Feedback[]>([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const res = await API.get<FeedbackResponse>("/feedback", {
        params: {
          category: category || undefined,
          status: status || undefined,
          search: search || undefined,
          sortBy,
          order,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data.data.items || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        console.error("Failed to fetch feedback", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, nextStatus: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      await API.patch(
        `/feedback/${id}`,
        { status: nextStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchFeedback();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        console.error("Failed to update status", err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchFeedback();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">
            Manage, review, and prioritize product feedback.
          </p>
        </div>

        <StatsBar items={items} />

        <div className="mb-6 grid gap-3 md:grid-cols-5">
          <input
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            placeholder="Search title or summary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Improvement">Improvement</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Sort by Date</option>
            <option value="ai_priority">Sort by Priority</option>
            <option value="ai_sentiment">Sort by Sentiment</option>
          </select>

          <button
            onClick={fetchFeedback}
            className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Loading feedback...
          </div>
        ) : (
          <>
            <DashboardTable items={items} onStatusChange={updateStatus} />

            <div className="grid gap-4 md:hidden">
              {items.map((item) => (
                <FeedbackCard
                  key={item._id}
                  title={item.title}
                  category={item.category}
                  sentiment={item.ai_sentiment}
                  priority={item.ai_priority}
                  summary={item.ai_summary}
                  date={item.createdAt}
                  status={item.status}
                  onStatusChange={(value) => updateStatus(item._id, value)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
