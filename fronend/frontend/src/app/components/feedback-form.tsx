"use client";

import { useState } from "react";
import axios from "axios";
import API from "@/app/lib/api";

type FeedbackCategory = "Bug" | "Feature Request" | "Improvement" | "Other";

type FeedbackFormData = {
  title: string;
  description: string;
  category: FeedbackCategory;
  submitterName: string;
  submitterEmail: string;
};

const initialState: FeedbackFormData = {
  title: "",
  description: "",
  category: "Feature Request",
  submitterName: "",
  submitterEmail: "",
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FeedbackFormData>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const descriptionLength = form.description.length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (form.description.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/feedback", form);
      setMessage(res.data.message ?? "Feedback submitted successfully");
      setForm(initialState);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Request failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-semibold">Submit Feedback</h2>
        <p className="mt-1 text-sm text-slate-300">
          Share bugs, requests, or improvements.
        </p>
      </div>

      <input
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
        placeholder="Feedback title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <div>
        <textarea
          className="min-h-35 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
          placeholder="Describe the issue or request..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {descriptionLength} characters
        </p>
      </div>

      <select
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value as FeedbackCategory,
          })
        }
      >
        <option value="Bug">Bug</option>
        <option value="Feature Request">Feature Request</option>
        <option value="Improvement">Improvement</option>
        <option value="Other">Other</option>
      </select>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
          placeholder="Name (optional)"
          value={form.submitterName}
          onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
        />
        <input
          type="email"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
          placeholder="Email (optional)"
          value={form.submitterEmail}
          onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
        />
      </div>

      {message && (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
