import Link from "next/link";
import {
  countInstitutions,
  getCategories,
  getImportReadyInstitutions,
} from "@/lib/institutions";

export default function InstitutionsPage() {
  const categories = getCategories();
  const { total, importReady } = countInstitutions();
  const ready = getImportReadyInstitutions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Institutions</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Australian banks, brokers, lenders, and insurers supported for onboarding.
          {importReady} of {total} have CSV import presets today. Confirm yours in{" "}
          <Link href="/setup" className="text-agent-pink-400 hover:underline">
            Setup
          </Link>
          .
        </p>
      </div>

      {ready.length > 0 ? (
        <section className="rounded-2xl border border-agent-500/30 bg-agent-600/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-agent-300">Ready to import</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Folder import supports CSV and PDF exports from any institution below.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ready.map((inst) => (
              <li key={inst.id}>
                <Link
                  href="/import"
                  className="inline-block rounded-md border border-agent-pink-500/40 bg-agent-btn px-3 py-1 text-sm text-agent-pink-400 transition hover:border-agent-pink-500/60 hover:shadow-agent-pink"
                >
                  {inst.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link href="/import" className="font-medium text-agent-pink-400 hover:underline">
              Open folder import →
            </Link>
          </p>
        </section>
      ) : null}

      {categories.map((category) => (
        <section key={category.id}>
          <h2 className="text-lg font-semibold text-zinc-200">{category.label}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {category.institutions.map((inst) => (
              <li
                key={inst.id}
                className="flex items-start justify-between rounded-lg border border-white/10 bg-ground-100 px-3 py-2 transition hover:border-agent-500/30"
              >
                <div>
                  <span className="font-medium text-zinc-100">{inst.label}</span>
                  {inst.reviewHints && inst.reviewHints.length > 0 ? (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Review: {inst.reviewHints.join(", ")}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-xs ${
                    inst.importReady
                      ? "bg-agent-500/20 text-agent-300 ring-1 ring-agent-500/30"
                      : "bg-ground-200 text-zinc-500"
                  }`}
                >
                  {inst.importReady ? "CSV" : "Soon"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
