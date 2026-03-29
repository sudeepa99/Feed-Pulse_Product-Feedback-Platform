"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import API from "@/app/lib/api";

type Feedback = {
  _id: string;
  title: string;
  category: string;
  status: string;
  ai_sentiment?: string;
  ai_priority?: number;
  ai_summary?: string;
  createdAt: string;
};

type FeedbackListResponse = {
  success: boolean;
  data: {
    items: Feedback[];
  };
  message: string;
  error: string | null;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await API.get<FeedbackListResponse>("/feedback", {
        params: { category, status, search, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data.data.items);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load feedback");
      } else {
        setError("Failed to load feedback");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, nextStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/feedback/${id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await loadFeedback();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update status");
      } else {
        setError("Failed to update status");
      }
    }
  };

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await API.get<FeedbackListResponse>("/feedback", {
          params: { category, status, search, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!ignore) {
          setItems(res.data.data.items);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load feedback");
          } else {
            setError("Failed to load feedback");
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [category, status, search]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">
            Manage, review, and prioritize feedback.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-4">Total Feedback</div>
          <div className="rounded-2xl bg-white/5 p-4">Open Items</div>
          <div className="rounded-2xl bg-white/5 p-4">Avg Priority</div>
          <div className="rounded-2xl bg-white/5 p-4">Top Tag</div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-xl bg-slate-900 px-4 py-3"
            placeholder="Search title or summary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl bg-slate-900 px-4 py-3"
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
            className="rounded-xl bg-slate-900 px-4 py-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button
            onClick={loadFeedback}
            className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950"
          >
            Apply
          </button>
        </div>

        {loading && <p className="mb-4 text-sm text-slate-400">Loading...</p>}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm text-slate-300">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Sentiment</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-white/10">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                      {item.ai_sentiment || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.ai_priority ?? "-"}</td>
                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                      className="rounded-lg bg-slate-900 px-3 py-2"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 md:hidden">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                  {item.ai_sentiment || "Pending"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{item.category}</p>
              <p className="mt-2 text-sm">
                Priority: {item.ai_priority ?? "-"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <select
                value={item.status}
                onChange={(e) => updateStatus(item._id, e.target.value)}
                className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2"
              >
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
