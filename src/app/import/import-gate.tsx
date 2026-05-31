import Link from "next/link";

export function ImportGate() {
  return (
    <div className="agent-card space-y-4 p-6">
      <h2 className="agent-heading text-lg text-zinc-50">
        Complete setup before importing
      </h2>
      <p className="text-sm text-zinc-400">
        Confirm the banks, brokers, credit cards, and lenders you use before
        importing documents. 0ERO uses your selections to classify files and flag
        missing accounts.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/setup" className="agent-btn">
          Go to Setup
        </Link>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm text-zinc-400 ring-1 ring-zinc-700 transition hover:text-zinc-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
