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

type DashboardStats = {
  totalFeedback: number;
  openItems: number;
  averagePriority: number;
  mostCommonTag: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type FeedbackResponse = {
  success: boolean;
  data: {
    items: Feedback[];
    pagination: Pagination;
  };
  message: string;
  error: string | null;
};

type WeeklySummary = {
  summary: string;
  top_themes: string[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [items, setItems] = useState<Feedback[]>([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(
    null,
  );
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalFeedback: 0,
    openItems: 0,
    averagePriority: 0,
    mostCommonTag: "-",
  });

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
          page,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data.data.items || []);
      setPagination(
        res.data.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      );
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
      setActionLoadingId(id);

      await API.patch(
        `/feedback/${id}`,
        { status: nextStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchFeedback();
      await fetchWeeklySummary();
      await fetchStats();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        console.error("Failed to update status", err);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const reanalyzeFeedback = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setActionLoadingId(id);

      await API.post(
        `/feedback/${id}/reanalyze`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchFeedback();
      await fetchWeeklySummary();
      await fetchStats();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        console.error("Failed to reanalyze feedback", err);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const fetchWeeklySummary = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await API.get("/feedback/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWeeklySummary(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to fetch weekly summary", err.response?.data);
      } else {
        console.error("Failed to fetch weekly summary", err);
      }

      setWeeklySummary({
        summary: "Weekly AI summary is currently unavailable.",
        top_themes: [],
      });
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await API.get("/feedback/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to fetch stats", err.response?.data);
      } else {
        console.error("Failed to fetch stats", err);
      }
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchFeedback();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchFeedback();
    fetchWeeklySummary();
    fetchStats();
  }, [page]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>

          {weeklySummary && (
            <div className="mb-6 mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <h2 className="text-lg font-semibold text-white">
                Weekly AI Summary
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {weeklySummary.summary}
              </p>

              {weeklySummary.top_themes?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {weeklySummary.top_themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-cyan-400/20 bg-slate-900 px-3 py-1 text-xs text-cyan-300"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="mt-1 text-slate-400">
            Manage, review, and prioritize product feedback.
          </p>
        </div>

        <StatsBar
          totalFeedback={stats.totalFeedback}
          openItems={stats.openItems}
          averagePriority={stats.averagePriority}
          mostCommonTag={stats.mostCommonTag}
        />
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
            onClick={handleApplyFilters}
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
            <DashboardTable
              items={items}
              onStatusChange={updateStatus}
              onReanalyze={reanalyzeFeedback}
              actionLoadingId={actionLoadingId}
            />

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
                  onReanalyze={() => reanalyzeFeedback(item._id)}
                  isLoading={actionLoadingId === item._id}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 md:flex-row">
              <p>
                Page{" "}
                <span className="font-semibold text-white">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {pagination.totalPages}
                </span>
                {" · "}
                Total items:{" "}
                <span className="font-semibold text-white">
                  {pagination.total}
                </span>
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-white/10 px-4 py-2 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                  }
                  disabled={
                    page === pagination.totalPages ||
                    pagination.totalPages === 0
                  }
                  className="rounded-xl border border-white/10 px-4 py-2 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
