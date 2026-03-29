type FeedbackCardProps = {
  title: string;
  category: string;
  sentiment?: string;
  priority?: number;
  summary?: string;
  date: string;
  status: string;
  onStatusChange?: (value: string) => void;
};

const sentimentStyles: Record<string, string> = {
  Positive: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  Neutral: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  Negative: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
  Pending: "bg-slate-800 text-slate-300 border border-slate-700",
};

const statusStyles: Record<string, string> = {
  New: "text-cyan-300",
  "In Review": "text-amber-300",
  Resolved: "text-emerald-300",
};

export default function FeedbackCard({
  title,
  category,
  sentiment,
  priority,
  summary,
  date,
  status,
  onStatusChange,
}: FeedbackCardProps) {
  const label = sentiment || "Pending";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{category}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            sentimentStyles[label] || sentimentStyles.Pending
          }`}
        >
          {label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>
          <span className="text-slate-400">Priority:</span> {priority ?? "-"}
        </p>
        <p>
          <span className="text-slate-400">Status:</span>{" "}
          <span className={statusStyles[status] || "text-slate-300"}>
            {status}
          </span>
        </p>
        <p>
          <span className="text-slate-400">Date:</span>{" "}
          {new Date(date).toLocaleDateString()}
        </p>
        {summary && (
          <p className="line-clamp-3 text-slate-400">
            <span className="text-slate-300">AI Summary:</span> {summary}
          </p>
        )}
      </div>

      {onStatusChange && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-4 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="New">New</option>
          <option value="In Review">In Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      )}
    </div>
  );
}
