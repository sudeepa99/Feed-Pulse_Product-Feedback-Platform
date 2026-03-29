"use client";

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

type Props = {
  items: Feedback[];
  onStatusChange: (id: string, status: string) => void;
};

const sentimentStyles: Record<string, string> = {
  Positive: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  Neutral: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  Negative: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
  Pending: "bg-slate-800 text-slate-300 border border-slate-700",
};

export default function DashboardTable({ items, onStatusChange }: Props) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/5 md:block">
      <table className="min-w-full text-left">
        <thead className="bg-white/5 text-sm text-slate-300">
          <tr>
            <th className="px-4 py-4">Title</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Sentiment</th>
            <th className="px-4 py-4">Priority</th>
            <th className="px-4 py-4">Summary</th>
            <th className="px-4 py-4">Date</th>
            <th className="px-4 py-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const label = item.ai_sentiment || "Pending";

            return (
              <tr key={item._id} className="border-t border-white/10 align-top">
                <td className="px-4 py-4 font-medium text-white">
                  {item.title}
                </td>
                <td className="px-4 py-4 text-slate-300">{item.category}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      sentimentStyles[label] || sentimentStyles.Pending
                    }`}
                  >
                    {label}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {item.ai_priority ?? "-"}
                </td>
                <td className="max-w-[280px] px-4 py-4 text-sm text-slate-400">
                  <p className="line-clamp-2">{item.ai_summary || "-"}</p>
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item._id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
