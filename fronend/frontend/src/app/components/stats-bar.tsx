type Feedback = {
  status: string;
  ai_priority?: number;
  ai_tags?: string[];
};

type Props = {
  items: Feedback[];
};

export default function StatsBar({ items }: Props) {
  const total = items.length;
  const openItems = items.filter((item) => item.status !== "Resolved").length;

  const priorities = items
    .map((item) => item.ai_priority)
    .filter((value): value is number => typeof value === "number");

  const averagePriority = priorities.length
    ? (priorities.reduce((a, b) => a + b, 0) / priorities.length).toFixed(1)
    : "-";

  const tags = items.flatMap((item) => item.ai_tags || []);
  const tagMap = tags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const mostCommonTag =
    Object.entries(tagMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const cards = [
    { label: "Total Feedback", value: total },
    { label: "Open Items", value: openItems },
    { label: "Avg Priority", value: averagePriority },
    { label: "Top Tag", value: mostCommonTag },
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
