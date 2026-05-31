import { describe, expect, it } from "vitest";
import { parseNabPdfLines, parseNabPdfText, parseNabStatementFilename } from "./nab-pdf-import";

describe("parseNabPdfText", () => {
  it("parses DD/MM/YYYY lines with debit and balance", () => {
    const text = `
Date Transaction Details Debits Credits Balance
01/07/2025 OPENING BALANCE 1,234.56
02/07/2025 EFTPOS WOOLWORTHS 5234 SYDNEY 45.50 1,189.06
03/07/2025 DIRECT CREDIT SALARY ACME PTY LTD 3,200.00 4,389.06
    `.trim();

    const { transactions, format } = parseNabPdfText(text);
    expect(format).toBe("nab-pdf");
    expect(transactions).toHaveLength(2);
    expect(transactions[0]).toMatchObject({
      postedAt: "2025-07-02",
      description: "EFTPOS WOOLWORTHS 5234 SYDNEY",
      amountCents: -4550,
      balanceCents: 118906,
    });
    expect(transactions[1].amountCents).toBe(320000);
  });

  it("parses DD Mon YYYY format", () => {
    const lines = [
      "02 Jul 2025 Visa Purchase Woolworths 45.50 1,189.06",
      "03 Jul 2025 Direct Credit Salary Acme 3200.00 4389.06",
    ];
    const { transactions } = parseNabPdfLines(lines);
    expect(transactions[0].postedAt).toBe("2025-07-02");
    expect(transactions[0].amountCents).toBe(-4550);
  });

  it("parses multi-line NAB credit card layout", () => {
    const lines = [
      "02 Dec 2025",
      "WOOLWORTHS 1234 SYDNEY NSW",
      "45.50",
      "03 Dec 2025",
      "PAYMENT RECEIVED - THANK YOU",
      "1,200.00 CR",
    ];
    const { transactions } = parseNabPdfLines(lines);
    expect(transactions).toHaveLength(2);
    expect(transactions[0].amountCents).toBe(-4550);
    expect(transactions[1].amountCents).toBe(120000);
  });

  it("parses short dates without year using statement filename date", () => {
    const lines = [
      "02 Dec",
      "WOOLWORTHS 1234 SYDNEY NSW",
      "45.50",
      "03 Dec",
      "PAYMENT RECEIVED - THANK YOU",
      "1,200.00 CR",
    ];
    const { transactions } = parseNabPdfLines(lines, {
      statementDate: "2025-12-02",
    });
    expect(transactions).toHaveLength(2);
    expect(transactions[0].postedAt).toBe("2025-12-02");
    expect(transactions[1].postedAt).toBe("2025-12-03");
  });

  it("parses duplicate transaction and post dates on one line", () => {
    const lines = [
      "02 Dec 2025 02 Dec 2025 WOOLWORTHS 1234 SYDNEY NSW 45.50",
    ];
    const { transactions } = parseNabPdfLines(lines);
    expect(transactions).toHaveLength(1);
    expect(transactions[0].description).toBe("WOOLWORTHS 1234 SYDNEY NSW");
  });

  it("parses 8255 NAB credit card statement filename", () => {
    expect(parseNabStatementFilename("8255-20251202-statement.pdf")).toEqual({
      last4: "8255",
      statementDate: "2025-12-02",
    });
  });

  it("parses amounts with CR suffix on one line", () => {
    const lines = ["15 Nov 2025 PAYMENT RECEIVED 500.00 CR"];
    const { transactions } = parseNabPdfLines(lines);
    expect(transactions[0].amountCents).toBe(50000);
  });

  it("parses NAB statement filename pattern", () => {
    expect(parseNabStatementFilename("1234-20251202-statement.pdf")).toEqual({
      last4: "1234",
      statementDate: "2025-12-02",
    });
  });

  it("returns unknown for empty extract", () => {
    expect(parseNabPdfText("NAB Account Statement\nBSB 083-004").format).toBe(
      "unknown",
    );
  });
});
