import FeedbackForm from "@/app/components/feedback-form";

export default function HomePage() {
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
