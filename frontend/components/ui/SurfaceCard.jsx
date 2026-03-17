import { classNames } from "../../lib/classNames";

const toneMap = {
  default: "border-slate-200/80 bg-white/88 shadow-card backdrop-blur-xl",
  hero: "border-slate-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(240,247,255,0.88))] shadow-card backdrop-blur-xl",
  contrast:
    "border-slate-900/10 bg-[linear-gradient(145deg,#081120,#14233a)] text-white shadow-card",
  subtle:
    "border-slate-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(247,250,255,0.82))] shadow-soft",
};

export default function SurfaceCard({ as: Tag = "section", tone = "default", className, children }) {
  return (
    <Tag
      className={classNames(
        "rounded-[28px] border p-6 transition duration-300",
        toneMap[tone] || toneMap.default,
        className
      )}
    >
      {children}
    </Tag>
  );
}
