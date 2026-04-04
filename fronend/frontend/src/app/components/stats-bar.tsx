type StatsBarProps = {
  totalFeedback: number;
  openItems: number;
  averagePriority: number;
  mostCommonTag: string;
};

export default function StatsBar({
  totalFeedback,
  openItems,
  averagePriority,
  mostCommonTag,
}: StatsBarProps) {
  const cards = [
    { label: "Total Feedback", value: totalFeedback },
    { label: "Open Items", value: openItems },
    {
      label: "Avg Priority",
      value: averagePriority ? averagePriority.toFixed(1) : "-",
    },
    { label: "Top Tag", value: mostCommonTag || "-" },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
