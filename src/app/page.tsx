import Link from "next/link";

const actions = [
  {
    href: "/setup",
    title: "Set up your profile",
    description: "Choose your banks, cards, and brokers — nothing pre-filled",
    primary: true,
  },
  {
    href: "/review",
    title: "Run tax review",
    description: "Walk through FY checks before you lodge in myTax",
    primary: false,
  },
  {
    href: "/import",
    title: "Import documents",
    description: "Folder import for CSV and PDF exports from AU institutions",
    primary: false,
  },
  {
    href: "/dashboard",
    title: "Open dashboard",
    description: "Ledger summary and tagged deductions",
    primary: false,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-ground-100 p-8 shadow-agent-lg md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-agent-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-agent-pink-500/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-agent-500/30 bg-agent-600/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-agent-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-agent-pink-400" />
            100% local · deterministic · no cloud
          </p>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
            Your myTax prep{" "}
            <span className="agent-heading">co-pilot</span> — on your Mac
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-400">
            Import bank CSVs, tag deductions, and get plain-English checks before
            you lodge. Everything stays on{" "}
            <code className="rounded bg-ground-200 px-1.5 py-0.5 text-sm text-agent-300">
              127.0.0.1
            </code>
            .
          </p>
        </div>

        <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col rounded-2xl border p-6 transition hover:scale-[1.02] ${
                action.primary
                  ? "border-agent-500/50 bg-agent-gradient shadow-agent hover:shadow-agent-lg"
                  : "border-white/10 bg-agent-btn hover:border-agent-pink-500/40 hover:shadow-agent-pink"
              }`}
            >
              <span
                className={`text-xl font-bold md:text-2xl ${
                  action.primary ? "text-white" : "text-zinc-100"
                }`}
              >
                {action.title}
              </span>
              <span
                className={`mt-2 flex-1 text-sm ${
                  action.primary ? "text-white/80" : "text-zinc-400"
                }`}
              >
                {action.description}
              </span>
              <span
                className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2 ${
                  action.primary ? "text-white" : "text-agent-pink-400"
                }`}
              >
                Go
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="agent-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agent-600/20 text-lg ring-1 ring-agent-500/30">
            🔒
          </div>
          <h2 className="mt-3 font-semibold text-zinc-100">Privacy first</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            SQLite ledger at <code className="text-agent-300">./data/ledger.db</code>.
            Run <code className="text-agent-300">npm run privacy:audit</code> — no
            cloud, no LLM calls.
          </p>
        </article>
        <article className="agent-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agent-600/20 text-lg ring-1 ring-agent-500/30">
            📋
          </div>
          <h2 className="mt-3 font-semibold text-zinc-100">myTax-oriented</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Checks map to real myTax items — WFH, D1 car, item T CGT, private
            health, and more.
          </p>
        </article>
        <article className="agent-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agent-pink-500/20 text-lg ring-1 ring-agent-pink-500/30">
            ⚖️
          </div>
          <h2 className="mt-3 font-semibold text-zinc-100">Not tax advice</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            A structured checklist to help you prepare — you lodge and sign in
            myTax. See DISCLAIMER.md.
          </p>
        </article>
      </section>
    </div>
  );
}
