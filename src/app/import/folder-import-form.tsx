"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { processImportFolder } from "@/lib/bank/batch-import";
import { CATEGORY_LABELS } from "@/lib/bank/classify-document";
import type { UserDiscoveryProfile } from "@/lib/discovery/user-discovery";
import type { BatchImportResult, ProcessedFile } from "@/lib/bank/import-types";

const STATUS_STYLES: Record<string, string> = {
  ok: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  failed: "bg-red-500/20 text-red-300 ring-red-500/30",
  skipped: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  partial: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
};

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "text-emerald-400",
  medium: "text-agent-300",
  low: "text-amber-400",
};

export function FolderImportForm({ profile }: { profile: UserDiscoveryProfile }) {
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [result, setResult] = useState<BatchImportResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = [...fileList];
    if (!files.length) {
      setProcessError(
        "No files were selected. Choose a folder that contains .csv or .pdf bank exports.",
      );
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    setProcessError(null);

    const root = files[0]?.webkitRelativePath?.split("/")[0];
    setFolderName(root ?? `${files.length} files`);

    try {
      const batch = await processImportFolder(files, profile);
      if (batch.summary.totalFiles === 0) {
        setProcessError(
          `Found ${files.length} file${files.length === 1 ? "" : "s"} in this folder, but none were .csv or .pdf exports. Try a folder of bank CSV/PDF statements.`,
        );
      }
      setResult(batch);
    } catch (err) {
      console.error("[0ERO import]", err);
      setProcessError(
        err instanceof Error
          ? err.message
          : "Could not process folder. Try again or use CSV exports.",
      );
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) void handleFiles(files);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) void handleFiles(files);
  };

  return (
    <div className="space-y-8">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-2xl border-2 border-dashed border-agent-500/40 bg-ground-100 px-6 py-10 text-center transition hover:border-agent-pink-500/50 hover:shadow-agent"
      >
        <p className="text-sm text-zinc-400">
          Select a <strong className="text-zinc-300">folder</strong> of bank CSVs
          and PDFs. 0ERO classifies each file, discovers your accounts, and flags
          what&apos;s missing — all locally in your browser.
        </p>
        <label className={`agent-btn mt-4 cursor-pointer ${loading ? "opacity-60" : ""}`}>
          {loading ? "Processing folder…" : "Choose folder"}
          <input
            type="file"
            multiple
            // @ts-expect-error webkitdirectory is non-standard but widely supported
            webkitdirectory=""
            directory=""
            className="hidden"
            disabled={loading}
            onChange={onFolderChange}
          />
        </label>
        {folderName ? (
          <p className="mt-2 text-xs text-agent-pink-400">{folderName}</p>
        ) : null}
      </div>

      {processError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {processError}
        </div>
      ) : null}

      {result ? (
        <>
          <SummaryBar result={result} />

          {result.accounts.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold text-zinc-100">Your accounts</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Discovered from {result.summary.parsedFiles} parsed file
                {result.summary.parsedFiles === 1 ? "" : "s"}.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.accounts.map((account) => (
                  <li
                    key={account.key}
                    className="rounded-xl border border-agent-500/30 bg-agent-600/10 px-4 py-3"
                  >
                    <p className="font-medium text-zinc-100">{account.accountLabel}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {CATEGORY_LABELS[account.accountCategory]} ·{" "}
                      {account.transactionCount} transactions · {account.fileCount} file
                      {account.fileCount === 1 ? "" : "s"}
                    </p>
                    {account.dateRange ? (
                      <p className="mt-1 text-xs text-agent-300">
                        {account.dateRange.from} → {account.dateRange.to}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {result.gaps.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold text-zinc-100">What might be missing</h2>
              {result.gaps.some((g) => g.id === "setup-incomplete") ? (
                <p className="mt-2 text-sm text-zinc-400">
                  <Link href="/setup" className="text-agent-pink-400 hover:underline">
                    Open Setup
                  </Link>{" "}
                  to confirm your institutions before gap checks can be tailored to you.
                </p>
              ) : null}
              <ul className="mt-4 space-y-3">
                {result.gaps.map((gap) => (
                  <li
                    key={gap.id}
                    className={`rounded-xl border px-4 py-3 ${
                      gap.severity === "action"
                        ? "border-red-500/30 bg-red-950/20"
                        : "border-agent-500/30 bg-agent-600/10"
                    }`}
                  >
                    <p className="font-medium text-zinc-100">{gap.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{gap.explanation}</p>
                    <p className="mt-2 text-sm text-agent-pink-400">{gap.nextStep}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="text-lg font-semibold text-zinc-100">Files</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-ground-100">
                  <tr>
                    <th className="px-3 py-2 font-medium text-agent-300">File</th>
                    <th className="px-3 py-2 font-medium text-agent-300">Account</th>
                    <th className="px-3 py-2 font-medium text-agent-300">Type</th>
                    <th className="px-3 py-2 font-medium text-agent-300">Confidence</th>
                    <th className="px-3 py-2 font-medium text-agent-300">Txns</th>
                    <th className="px-3 py-2 font-medium text-agent-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.files.map((file) => (
                    <FileRow
                      key={file.id}
                      file={file}
                      expanded={expandedFile === file.id}
                      onToggle={() =>
                        setExpandedFile(expandedFile === file.id ? null : file.id)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function SummaryBar({ result }: { result: BatchImportResult }) {
  const { summary } = result;
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <span className="rounded-full bg-agent-500/20 px-3 py-1 font-medium text-agent-300 ring-1 ring-agent-500/30">
        {summary.totalFiles} files
      </span>
      <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-medium text-emerald-300 ring-1 ring-emerald-500/30">
        {summary.parsedFiles} parsed
      </span>
      {summary.failedFiles > 0 ? (
        <span className="rounded-full bg-red-500/20 px-3 py-1 font-medium text-red-300 ring-1 ring-red-500/30">
          {summary.failedFiles} failed
        </span>
      ) : null}
      <span className="rounded-full bg-ground-200 px-3 py-1 font-medium text-zinc-300">
        {summary.totalTransactions} transactions
      </span>
      <span className="rounded-full bg-agent-pink-500/20 px-3 py-1 font-medium text-agent-pink-400 ring-1 ring-agent-pink-500/30">
        {result.accounts.length} account{result.accounts.length === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function FileRow({
  file,
  expanded,
  onToggle,
}: {
  file: ProcessedFile;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { classification: c } = file;
  return (
    <>
      <tr
        className="cursor-pointer border-b border-white/5 hover:bg-white/5"
        onClick={onToggle}
      >
        <td className="max-w-[200px] truncate px-3 py-2 text-zinc-300" title={file.relativePath}>
          {file.fileName}
        </td>
        <td className="px-3 py-2 text-zinc-400">{c.accountLabel}</td>
        <td className="px-3 py-2 text-zinc-500">{CATEGORY_LABELS[c.accountCategory]}</td>
        <td className={`px-3 py-2 ${CONFIDENCE_STYLES[c.confidence]}`}>{c.confidence}</td>
        <td className="px-3 py-2 text-zinc-400">{file.transactionCount || "—"}</td>
        <td className="px-3 py-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs ring-1 ${STATUS_STYLES[file.parseStatus]}`}
          >
            {file.parseStatus}
          </span>
        </td>
      </tr>
      {expanded ? (
        <tr className="border-b border-white/5 bg-ground/50">
          <td colSpan={6} className="px-3 py-3 text-xs text-zinc-500">
            {file.error ? (
              <p className="text-red-400">{file.error}</p>
            ) : null}
            {c.signals.length > 0 ? (
              <p className="mt-1">
                <span className="text-agent-300">Classification: </span>
                {c.signals.join(" · ")}
              </p>
            ) : null}
            {file.parseFormat ? (
              <p className="mt-1">
                Format: {file.parseFormat}
                {file.dateRange
                  ? ` · ${file.dateRange.from} to ${file.dateRange.to}`
                  : ""}
              </p>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}
