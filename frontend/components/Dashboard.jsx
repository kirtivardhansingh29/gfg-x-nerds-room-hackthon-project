import ChartCard from "./ChartCard";
import SurfaceCard from "./ui/SurfaceCard";
import SkeletonBlock from "./ui/SkeletonBlock";

const EMPTY_STATE_PROMPTS = [
  "Compare online vs offline spend by shopping preference.",
  "Which city tier has the highest average monthly online orders?",
  "Show a correlation between age and daily internet hours.",
];

export default function Dashboard({ cards, isLoading, onPromptSelect }) {
  return (
    <section id="dashboard" className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Dashboard
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Insight cards designed for quick business review
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Every successful query becomes a reusable card with a summary, chart, SQL trace, and a
            preview of the underlying rows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DashboardBadge label={`${cards.length} cards`} />
          <DashboardBadge label={isLoading ? "Updating now" : "Live dashboard"} />
        </div>
      </div>

      {!cards.length ? (
        isLoading ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCardSkeleton featured />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
        ) : (
          <SurfaceCard className="grid gap-6 p-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Interactive Dashboard
              </p>
              <h3 className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
                Your first insight will land here
              </h3>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Ask a question and Baniya Dost will create a polished dashboard card with the most
                appropriate visualization for the query result.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {EMPTY_STATE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onPromptSelect(prompt)}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(236,244,255,0.9))] p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Prompt Idea
                  </p>
                  <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-slate-950">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </SurfaceCard>
        )
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {cards.map((card, index) => (
            <ChartCard key={card.id} card={card} featured={index === 0} />
          ))}
          {isLoading ? <ChartCardSkeleton /> : null}
        </div>
      )}
    </section>
  );
}

function DashboardBadge({ label }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-soft">
      {label}
    </span>
  );
}

function ChartCardSkeleton({ featured = false }) {
  return (
    <SurfaceCard className={featured ? "xl:col-span-2" : ""}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-9 w-72" />
            <SkeletonBlock className="h-4 w-full max-w-xl" />
          </div>
          <SkeletonBlock className="h-14 w-36" />
        </div>
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-[280px] w-full rounded-[24px]" />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SkeletonBlock className="h-40 w-full rounded-[24px]" />
          <div className="grid gap-4">
            <SkeletonBlock className="h-28 w-full rounded-[24px]" />
            <SkeletonBlock className="h-28 w-full rounded-[24px]" />
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
