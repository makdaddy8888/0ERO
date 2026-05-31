import { defaultReviewContext } from "@/lib/tax/review-context-default";
import { runFullReview } from "@/lib/tax/review-engine";

const severityStyles: Record<string, string> = {
  action: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-slate-200 bg-white text-slate-800",
};

export default function ReviewPage() {
  const ctx = defaultReviewContext();
  const flags = runFullReview(ctx);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Tax review</h1>
        <p className="mt-1 text-sm text-slate-600">
          FY {ctx.financialYear} — deterministic questions from the review engine
          (generic template data).
        </p>
      </div>

      <ul className="space-y-3">
        {flags.map((flag) => (
          <li
            key={flag.id}
            className={`rounded-lg border px-4 py-3 ${severityStyles[flag.severity]}`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide opacity-80">
              <span>{flag.module}</span>
              <span>·</span>
              <span>{flag.severity}</span>
              {flag.relatedCategory ? (
                <>
                  <span>·</span>
                  <span>{flag.relatedCategory}</span>
                </>
              ) : null}
            </div>
            <p className="mt-2 font-medium">{flag.question}</p>
            {flag.detail ? (
              <p className="mt-1 text-sm opacity-90">{flag.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
