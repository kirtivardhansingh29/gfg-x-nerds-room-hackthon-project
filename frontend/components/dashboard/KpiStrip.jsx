import { classNames } from "../../lib/classNames";
import SurfaceCard from "../ui/SurfaceCard";
import SkeletonBlock from "../ui/SkeletonBlock";

const toneMap = {
  accent: "from-emerald-100/90 to-teal-50",
  sky: "from-sky-100/90 to-indigo-50",
  gold: "from-amber-100/90 to-orange-50",
  slate: "from-slate-100/90 to-white",
};

export default function KpiStrip({ metrics, isLoading }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <SurfaceCard
          key={metric.label}
          className={classNames(
            "overflow-hidden bg-gradient-to-br p-5",
            toneMap[metric.tone] || toneMap.slate
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {metric.label}
              </p>
              {isLoading ? (
                <SkeletonBlock className="h-10 w-24" />
              ) : (
                <p className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
                  {metric.value}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {metric.badge}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">{metric.helper}</p>
        </SurfaceCard>
      ))}
    </section>
  );
}
