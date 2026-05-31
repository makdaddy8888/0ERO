export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-50">Dashboard</h1>
      <p className="text-zinc-400">
        Placeholder for accounts, transactions, and import workflows. Connect your
        local SQLite ledger via <code className="text-agent-300">src/lib/db</code> as
        you build out features.
      </p>
      <div className="rounded-2xl border border-dashed border-white/15 bg-ground-100 p-8 text-center text-sm text-zinc-500">
        No data loaded — generic template only.
      </div>
    </div>
  );
}
