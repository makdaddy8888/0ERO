export interface CgtDisposalInput {
  proceedsCents: number;
  costBaseCents: number;
  discountEligible: boolean;
  heldDays?: number;
}

export interface CgtResult {
  grossGainCents: number;
  grossLossCents: number;
  discountAppliedCents: number;
  netTaxableGainCents: number;
}

/** Deterministic CGT helper (individual assets, generic). */
export function calculateCgt(disposal: CgtDisposalInput): CgtResult {
  const diff = disposal.proceedsCents - disposal.costBaseCents;

  if (diff <= 0) {
    return {
      grossGainCents: 0,
      grossLossCents: Math.abs(diff),
      discountAppliedCents: 0,
      netTaxableGainCents: 0,
    };
  }

  let discountAppliedCents = 0;
  let netGain = diff;

  const heldLongEnough =
    disposal.heldDays === undefined ? disposal.discountEligible : disposal.heldDays >= 365;

  if (disposal.discountEligible && heldLongEnough) {
    discountAppliedCents = Math.floor(diff / 2);
    netGain = diff - discountAppliedCents;
  }

  return {
    grossGainCents: diff,
    grossLossCents: 0,
    discountAppliedCents,
    netTaxableGainCents: netGain,
  };
}

export function sumNetGainsAud(disposals: CgtDisposalInput[]): number {
  let netCents = 0;
  for (const d of disposals) {
    const r = calculateCgt(d);
    netCents += r.netTaxableGainCents - r.grossLossCents;
  }
  return netCents / 100;
}
