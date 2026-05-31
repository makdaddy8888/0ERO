import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>Offline &amp; no AI:</strong> 0ERO runs on{" "}
        <code className="rounded bg-amber-100 px-1">127.0.0.1</code> only. The tax
        review engine is deterministic TypeScript — no LLM or cloud APIs at runtime.
      </div>

      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-brand-800">
          Local Australian tax prep helper
        </h1>
        <p className="max-w-2xl text-slate-600">
          Organise generic ledger data, import CSV templates, and walk structured
          myTax-oriented review questions before you lodge. No personal data ships
          with this app.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/review"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            Run tax review
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Privacy</h2>
          <p className="mt-2 text-sm text-slate-600">
            SQLite ledger at <code>./data/ledger.db</code>. Run{" "}
            <code>npm run privacy:audit</code> to verify no AI SDKs or external
            fetches in source.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Not tax advice</h2>
          <p className="mt-2 text-sm text-slate-600">
            See DISCLAIMER.md. You are responsible for updating the app and your
            return.
          </p>
        </article>
      </section>
    </div>
  );
}
