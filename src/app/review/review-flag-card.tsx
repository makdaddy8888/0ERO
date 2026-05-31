import type { ReviewFlag } from "@/lib/tax/review-engine/types";
import {
  MODULE_LABELS,
  MYTAX_CATEGORY_HINTS,
  SEVERITY_LABELS,
} from "@/lib/tax/review-labels";

const severityStyles: Record<
  string,
  { card: string; badge: string; dot: string }
> = {
  action: {
    card: "border-red-500/30 bg-red-950/30",
    badge: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30",
    dot: "bg-red-400",
  },
  warning: {
    card: "border-amber-500/30 bg-amber-950/20",
    badge: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30",
    dot: "bg-amber-400",
  },
  info: {
    card: "border-agent-500/30 bg-agent-600/10",
    badge: "bg-agent-500/20 text-agent-300 ring-1 ring-agent-500/30",
    dot: "bg-agent-pink-400",
  },
};

export function ReviewFlagCard({ flag }: { flag: ReviewFlag }) {
  const styles = severityStyles[flag.severity] ?? severityStyles.info;
  const severity = SEVERITY_LABELS[flag.severity];
  const moduleLabel = MODULE_LABELS[flag.module] ?? flag.module;
  const myTaxHint = flag.relatedCategory
    ? MYTAX_CATEGORY_HINTS[flag.relatedCategory]
    : null;

  return (
    <li className={`rounded-2xl border p-5 ${styles.card}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}>
            {severity?.label ?? flag.severity}
          </span>
          <span className="text-xs text-zinc-500">{moduleLabel}</span>
        </div>
        {myTaxHint ? (
          <span className="rounded-md bg-ground-200 px-2 py-0.5 text-xs text-zinc-400">
            {myTaxHint}
          </span>
        ) : null}
      </div>

      <h2 className="mt-3 text-lg font-semibold text-zinc-100">{flag.title}</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="font-medium text-agent-300">What this check does</p>
          <p className="mt-1 leading-relaxed text-zinc-400">{flag.explanation}</p>
        </div>

        {flag.detail ? (
          <p className="rounded-lg bg-ground/60 px-3 py-2 font-mono text-xs text-agent-pink-400 ring-1 ring-white/10">
            {flag.detail}
          </p>
        ) : null}

        <div className="rounded-lg bg-ground/50 px-3 py-3 ring-1 ring-agent-500/20">
          <p className="font-medium text-agent-pink-400">What to do next</p>
          <p className="mt-1 leading-relaxed text-zinc-300">{flag.nextStep}</p>
        </div>
      </div>
    </li>
  );
}
