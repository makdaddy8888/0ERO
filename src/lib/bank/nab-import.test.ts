import { describe, expect, it } from "vitest";
import { parseNabCsv } from "./nab-import";

const SAMPLE_AMOUNT_FORMAT = `Date,Amount,Account Balance,Narrative
01/07/2025,-45.50,1234.56,WOOLWORTHS 1234
02/07/2025,3200.00,4434.56,SALARY ACME PTY LTD
03/07/2025,-12.00,4422.56,Coffee Shop`;

const SAMPLE_DEBIT_CREDIT_FORMAT = `Date,Narrative,Debit Amount,Credit Amount,Balance
01/08/2025,ATM WITHDRAWAL,100.00,,900.00
02/08/2025,Salary,,2500.00,3400.00`;

describe("parseNabCsv", () => {
  it("parses Date, Amount, Balance, Narrative format", () => {
    const { transactions, format } = parseNabCsv(SAMPLE_AMOUNT_FORMAT);
    expect(format).toBe("nab-amount");
    expect(transactions).toHaveLength(3);
    expect(transactions[0]).toMatchObject({
      postedAt: "2025-07-01",
      description: "WOOLWORTHS 1234",
      amountCents: -4550,
      balanceCents: 123456,
    });
    expect(transactions[1].amountCents).toBe(320000);
  });

  it("parses debit/credit column format", () => {
    const { transactions, format } = parseNabCsv(SAMPLE_DEBIT_CREDIT_FORMAT);
    expect(format).toBe("nab-debit-credit");
    expect(transactions).toHaveLength(2);
    expect(transactions[0].amountCents).toBe(-10000);
    expect(transactions[1].amountCents).toBe(250000);
  });

  it("returns empty for unknown headers", () => {
    const result = parseNabCsv("Foo,Bar\n1,2");
    expect(result.transactions).toHaveLength(0);
    expect(result.format).toBe("unknown");
  });
});
