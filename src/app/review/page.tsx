import Link from "next/link";
import { defaultReviewContext } from "@/lib/tax/review-context-default";
import { runFullReview } from "@/lib/tax/review-engine";
import { ReviewFlagCard } from "./review-flag-card";

export default function ReviewPage() {
  const ctx = defaultReviewContext();
  const flags = runFullReview(ctx);
  const actions = flags.filter((f) => f.severity === "action").length;
  const warnings = flags.filter((f) => f.severity === "warning").length;
  const infos = flags.filter((f) => f.severity === "info").length;
  const isEmptyLedger =
    ctx.taggedDeductionsAud === 0 && ctx.cgtNetGainAud === 0;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-agent-400 transition hover:text-agent-pink-400">
          ← Home
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-zinc-50">Tax review</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          FY {ctx.financialYear} — 0ERO walks your ledger and flags things to
          confirm before you lodge in myTax. Each item explains what was checked,
          what we found, and what to do next.
        </p>
      </div>

      {isEmptyLedger ? (
        <div className="rounded-2xl border border-agent-500/30 bg-agent-600/10 px-5 py-4">
          <p className="font-medium text-agent-300">Starting from a blank ledger</p>
          <p className="mt-1 text-sm text-zinc-400">
            You haven&apos;t imported bank data or tagged deductions yet, so most
            checks below are &ldquo;heads up&rdquo; prompts — not errors. Complete{" "}
            <Link href="/setup" className="font-medium text-agent-pink-400 hover:underline">
              Setup
            </Link>
            , then{" "}
            <Link href="/import" className="font-medium text-agent-pink-400 hover:underline">
              import your documents
            </Link>{" "}
            to get tailored results.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 text-sm">
        {actions > 0 ? (
          <span className="rounded-full bg-red-500/20 px-3 py-1 font-medium text-red-300 ring-1 ring-red-500/30">
            {actions} action{actions === 1 ? "" : "s"}
          </span>
        ) : null}
        {warnings > 0 ? (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 font-medium text-amber-300 ring-1 ring-amber-500/30">
            {warnings} warning{warnings === 1 ? "" : "s"}
          </span>
        ) : null}
        {infos > 0 ? (
          <span className="rounded-full bg-agent-500/20 px-3 py-1 font-medium text-agent-300 ring-1 ring-agent-500/30">
            {infos} to confirm
          </span>
        ) : null}
      </div>

      <ul className="space-y-4">
        {flags.map((flag) => (
          <ReviewFlagCard key={flag.id} flag={flag} />
        ))}
      </ul>
    </div>
  );
}
