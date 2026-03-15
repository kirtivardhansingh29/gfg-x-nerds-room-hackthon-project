import ChartCard from "./ChartCard";

const EMPTY_STATE_PROMPTS = [
  "Compare online vs offline spend by shopping preference.",
  "Which city tier has the highest average monthly online orders?",
  "Show a correlation between age and daily internet hours.",
];

export default function Dashboard({ cards, isLoading }) {
  if (!cards.length) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Interactive Dashboard
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Insights will land here</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Each query creates a reusable dashboard card with the generated SQL, a short insight,
              and a chart chosen from the result shape.
            </p>
          </div>
          {isLoading ? (
            <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">
              Building your first visualization...
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {EMPTY_STATE_PROMPTS.map((prompt) => (
            <div
              key={prompt}
              className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(15,157,141,0.04),rgba(255,122,89,0.08))] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Prompt Idea
              </p>
              <p className="mt-3 font-heading text-xl font-bold text-ink">{prompt}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Dynamic Dashboard Grid
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Generated insight cards</h2>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">
            Updating dashboard...
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {cards.map((card) => (
          <ChartCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
