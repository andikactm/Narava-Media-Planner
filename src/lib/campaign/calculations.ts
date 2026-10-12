// calculations.ts
// ponytail: deterministic pure calculation engine; extend with platform tax or currency converters if multi-currency required.

export interface AwarenessParams {
  impressions: number
  cpm: number
}

export interface TrafficParams {
  clicks: number
  cpc: number
}

export interface ConversionParams {
  conversions: number
  cvr: number // Decimal (e.g., 0.02 for 2%)
  cpc: number
}

export interface BreakEvenParams {
  productPrice: number
  margin: number // Decimal (e.g., 0.40 for 40%)
}

/**
 * Budget = (Impressions / 1,000) * CPM
 */
export function calculateAwarenessBudget({ impressions, cpm }: AwarenessParams): number {
  if (impressions <= 0 || cpm <= 0) return 0
  return Math.round((impressions / 1000) * cpm)
}

/**
 * Budget = Clicks * CPC
 */
export function calculateTrafficBudget({ clicks, cpc }: TrafficParams): number {
  if (clicks <= 0 || cpc <= 0) return 0
  return Math.round(clicks * cpc)
}

/**
 * Clicks Needed = Conversions / CVR
 * Budget = Clicks Needed * CPC
 */
export function calculateConversionBudget({ conversions, cvr, cpc }: ConversionParams): {
  clicksNeeded: number
  budget: number
  impliedCpa: number
} {
  if (conversions <= 0 || cvr <= 0 || cpc <= 0) {
    return { clicksNeeded: 0, budget: 0, impliedCpa: 0 }
  }
  const clicksNeeded = Math.ceil(conversions / cvr)
  const budget = Math.round(clicksNeeded * cpc)
  const impliedCpa = Math.round(budget / conversions)
  return { clicksNeeded, budget, impliedCpa }
}

/**
 * Break-even CPA = Product Price * Margin
 */
export function calculateBreakEvenCPA({ productPrice, margin }: BreakEvenParams): number {
  if (productPrice <= 0 || margin <= 0) return 0
  return Math.round(productPrice * margin)
}

/**
 * Break-even ROAS = 1 / Margin
 */
export function calculateBreakEvenROAS({ margin }: { margin: number }): number {
  if (margin <= 0) return 0
  return Number((1 / margin).toFixed(2))
}

export type BiddingFenceStatus = 'SAFE' | 'WARNING' | 'UNPROFITABLE'

/**
 * Evaluates target CPA vs Break-even CPA
 */
export function evaluateCPAFence(targetCPA: number, breakEvenCPA: number): {
  status: BiddingFenceStatus
  difference: number
  marginSafetyPercent: number
} {
  if (breakEvenCPA <= 0 || targetCPA <= 0) {
    return { status: 'WARNING', difference: 0, marginSafetyPercent: 0 }
  }

  const difference = breakEvenCPA - targetCPA
  const marginSafetyPercent = (difference / breakEvenCPA) * 100

  if (targetCPA > breakEvenCPA) {
    return { status: 'UNPROFITABLE', difference, marginSafetyPercent }
  }
  if (marginSafetyPercent < 15) {
    return { status: 'WARNING', difference, marginSafetyPercent }
  }
  return { status: 'SAFE', difference, marginSafetyPercent }
}

/**
 * Evaluates target ROAS vs Break-even ROAS
 */
export function evaluateROASFence(targetROAS: number, breakEvenROAS: number): {
  status: BiddingFenceStatus
  difference: number
} {
  if (breakEvenROAS <= 0 || targetROAS <= 0) {
    return { status: 'WARNING', difference: 0 }
  }

  const difference = targetROAS - breakEvenROAS
  if (targetROAS < breakEvenROAS) {
    return { status: 'UNPROFITABLE', difference }
  }
  if (targetROAS <= breakEvenROAS * 1.15) {
    return { status: 'WARNING', difference }
  }
  return { status: 'SAFE', difference }
}
