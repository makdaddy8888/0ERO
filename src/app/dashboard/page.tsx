export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-800">Dashboard</h1>
      <p className="text-slate-600">
        Placeholder for accounts, transactions, and import workflows. Connect your
        local SQLite ledger via <code>src/lib/db</code> as you build out features.
      </p>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No data loaded — generic template only.
      </div>
    </div>
  );
}
