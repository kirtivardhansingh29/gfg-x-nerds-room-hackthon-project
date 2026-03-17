import { useId } from "react";

import { classNames } from "../../lib/classNames";

export default function BrandLogo({ compact = false, className, theme = "light" }) {
  const gradientId = useId().replace(/:/g, "");
  const textTone = theme === "dark" ? "text-white" : "text-slate-950";
  const captionTone = theme === "dark" ? "text-white/60" : "text-slate-500";

  return (
    <div className={classNames("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 56 56"
        role="img"
        aria-label="Baniya Dost logo"
        className={compact ? "h-10 w-10" : "h-12 w-12"}
      >
        <defs>
          <linearGradient id={gradientId} x1="7" y1="6" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F766E" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="48" height="48" rx="16" fill="#0B1628" />
        <rect x="8" y="8" width="40" height="40" rx="14" fill={`url(#${gradientId})`} opacity="0.18" />
        <path
          d="M17 36V27.5C17 26.12 18.12 25 19.5 25S22 26.12 22 27.5V36"
          stroke="#E2F5F3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M27 36V20.5C27 19.12 28.12 18 29.5 18S32 19.12 32 20.5V36"
          stroke="#E2F5F3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M37 36V24.5C37 23.12 38.12 22 39.5 22S42 23.12 42 24.5V36"
          stroke="#E2F5F3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16 15.5C20.5 12.5 25.5 11.8 31.2 14.4C34.8 16.1 37.8 16.1 40.8 12.8"
          stroke="#F8FAFC"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="41" cy="13" r="2.5" fill="#F59E0B" />
      </svg>

      <div className="space-y-0.5">
        <div className={classNames("font-heading text-lg font-semibold tracking-tight", textTone)}>Baniya Dost</div>
        {!compact ? (
          <div className={classNames("text-[11px] font-semibold uppercase tracking-[0.26em]", captionTone)}>
            Conversational BI
          </div>
        ) : null}
      </div>
    </div>
  );
}
