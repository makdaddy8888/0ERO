import Link from "next/link";

export function ImportDbError({ message }: { message: string }) {
  return (
    <div className="agent-card space-y-4 border-red-500/30 p-6">
      <h2 className="text-lg font-semibold text-red-300">Database error</h2>
      <p className="text-sm text-zinc-400">{message}</p>
      <p className="text-sm text-zinc-500">
        This is usually a stale dev server or corrupted build cache. Try in your terminal:
      </p>
      <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-zinc-300">
        npm run dev:clean
      </pre>
      <p className="text-sm text-zinc-500">
        Or use a production build (more reliable locally):
      </p>
      <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-zinc-300">
        npm run build && npm run start
      </pre>
      <Link href="/" className="agent-btn inline-block">
        Back to home
      </Link>
    </div>
  );
}
