import Link from "next/link";
import { isDiscoveryComplete as isProfileComplete } from "@/lib/discovery/user-discovery";
import { loadDiscoveryProfile } from "@/lib/discovery/discovery-repository";
import { FolderImportForm } from "./folder-import-form";
import { ImportGate } from "./import-gate";
import { ImportDbError } from "./import-db-error";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  let profile = null;
  try {
    // Profile loaded from SQLite on the server — not localStorage.
    profile = await loadDiscoveryProfile();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not open local database.";
    console.error("[0ERO import]", error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Import financial documents</h1>
        </div>
        <ImportDbError message={message} />
      </div>
    );
  }

  const complete = isProfileComplete(profile);

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

      {complete && profile ? (
        <FolderImportForm profile={profile} />
      ) : (
        <ImportGate />
      )}
    </div>
  );
}
