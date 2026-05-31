import Link from "next/link";
import { FolderImportForm } from "./folder-import-form";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/setup"
          className="text-sm text-agent-400 transition hover:text-agent-pink-400"
        >
          ← Setup
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-50">Import financial documents</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Select a folder of bank CSVs and PDFs. 0ERO classifies each file (everyday
          account, credit card, broker, etc.), builds a picture of your accounts, and
          flags gaps based on the institutions you confirmed in Setup.
        </p>
      </div>

      <FolderImportForm />
    </div>
  );
}
