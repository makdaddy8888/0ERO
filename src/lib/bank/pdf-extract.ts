/** Browser-only PDF text extraction — runs locally, no upload. */

interface PdfTextItem {
  str: string;
  transform: number[];
}

type PdfJsModule = typeof import("pdfjs-dist");

export async function extractPdfLinesFromFile(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  return extractPdfLinesFromBuffer(buffer);
}

export async function extractPdfLinesFromBuffer(data: ArrayBuffer): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  configurePdfWorker(pdfjs);

  try {
    return await extractAllPages(pdfjs, data);
  } catch (firstError) {
    if (typeof window !== "undefined") {
      const version =
        (pdfjs as PdfJsModule & { version?: string }).version ?? "4.10.38";
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
      try {
        return await extractAllPages(pdfjs, data);
      } catch (retryError) {
        throw formatPdfError(retryError, firstError);
      }
    }
    throw formatPdfError(firstError);
  }
}

function configurePdfWorker(pdfjs: PdfJsModule): void {
  if (pdfjs.GlobalWorkerOptions.workerSrc) return;

  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
  } else {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
}

async function extractAllPages(pdfjs: PdfJsModule, data: ArrayBuffer): Promise<string[]> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const lines: string[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    lines.push(...groupItemsIntoLines(content.items as PdfTextItem[]));
  }

  return lines;
}

function formatPdfError(error: unknown, prior?: unknown): Error {
  const message =
    error instanceof Error ? error.message : "Could not read PDF.";
  const priorMessage =
    prior instanceof Error ? prior.message : prior ? String(prior) : null;

  if (/worker|fetch|Loading/i.test(message)) {
    return new Error(
      "Could not load the PDF reader. Refresh the page and try again. If this keeps failing, re-export as CSV from internet banking.",
    );
  }

  if (priorMessage && priorMessage !== message) {
    return new Error(`${message} (${priorMessage})`);
  }

  return error instanceof Error ? error : new Error(message);
}

/** Group PDF text items by Y position to reconstruct table rows. */
export function groupItemsIntoLines(
  items: PdfTextItem[],
  yTolerance = 6,
): string[] {
  const positioned = items
    .filter((item) => item.str?.trim())
    .map((item) => ({
      str: item.str.trim(),
      x: item.transform[4] ?? 0,
      y: Math.round(item.transform[5] ?? 0),
    }))
    .sort((a, b) => b.y - a.y || a.x - b.x);

  if (positioned.length === 0) return [];

  const lines: string[] = [];
  let rowY = positioned[0].y;
  let rowParts: { str: string; x: number }[] = [];

  for (const item of positioned) {
    if (Math.abs(item.y - rowY) > yTolerance) {
      if (rowParts.length) lines.push(joinRowParts(rowParts));
      rowParts = [{ str: item.str, x: item.x }];
      rowY = item.y;
    } else {
      rowParts.push({ str: item.str, x: item.x });
    }
  }

  if (rowParts.length) lines.push(joinRowParts(rowParts));

  return lines;
}

function joinRowParts(parts: { str: string; x: number }[]): string {
  parts.sort((a, b) => a.x - b.x);
  return parts.map((p) => p.str).join(" ").replace(/\s+/g, " ").trim();
}
