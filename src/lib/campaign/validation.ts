// validation.ts
// ponytail: deterministic validation suite; expands as more channel-specific constraints arise.

export interface ValidationIssue {
  code: string
  severity: 'info' | 'warning' | 'error'
  title: string
  message: string
  field?: string
  phaseId?: string
}

export interface CampaignValidationInput {
  totalBudget: number
  phases: Array<{
    id: string
    name: string
    objective: string
    budget: number
    budgetPercentage: number
    startDate: string
    endDate: string
    targetCpa?: number
    targetRoas?: number
  }>
  productPrice?: number
  margin?: number
  checklistCompletedCount: number
}

export function validateCampaign(input: CampaignValidationInput): {
  isValid: boolean
  canPublish: boolean
  issues: ValidationIssue[]
} {
  const issues: ValidationIssue[] = []

  // 1. Budget sum verification
  const phaseBudgetSum = input.phases.reduce((acc, p) => acc + (p.budget || 0), 0)
  const phasePercentageSum = input.phases.reduce((acc, p) => acc + (p.budgetPercentage || 0), 0)

  if (input.totalBudget > 0 && Math.abs(phaseBudgetSum - input.totalBudget) > 1) {
    issues.push({
      code: 'BUDGET_MISMATCH',
      severity: 'error',
      title: 'Total budget fase tidak sesuai',
      message: `Total alokasi budget fase (Rp${phaseBudgetSum.toLocaleString('id-ID')}) harus sama persis dengan budget campaign (Rp${input.totalBudget.toLocaleString('id-ID')}).`,
      field: 'total_budget'
    })
  }

  if (input.phases.length > 0 && Math.abs(phasePercentageSum - 100) > 0.01) {
    issues.push({
      code: 'PERCENTAGE_MISMATCH',
      severity: 'error',
      title: 'Persentase budget tidak 100%',
      message: `Total persentase budget fase saat ini ${phasePercentageSum}%, wajib berjumlah tepat 100%.`,
      field: 'budget_percentage'
    })
  }

  // 2. Break-even verification
  if (input.productPrice && input.margin && input.productPrice > 0 && input.margin > 0) {
    const breakEvenCPA = input.productPrice * input.margin
    const breakEvenROAS = 1 / input.margin

    input.phases.forEach((phase) => {
      if (phase.targetCpa && phase.targetCpa > breakEvenCPA) {
        issues.push({
          code: 'CPA_ABOVE_BREAK_EVEN',
          severity: 'error',
          title: 'Target CPA melewati break-even',
          message: `Fase "${phase.name}": Target CPA Rp${phase.targetCpa.toLocaleString('id-ID')} melebihi batas break-even Rp${Math.round(breakEvenCPA).toLocaleString('id-ID')}.`,
          phaseId: phase.id,
          field: 'target_cpa'
        })
      }

      if (phase.targetRoas && phase.targetRoas < breakEvenROAS) {
        issues.push({
          code: 'ROAS_BELOW_BREAK_EVEN',
          severity: 'error',
          title: 'Target ROAS di bawah break-even',
          message: `Fase "${phase.name}": Target ROAS ${phase.targetRoas}x di bawah batas minimal break-even ${breakEvenROAS.toFixed(2)}x.`,
          phaseId: phase.id,
          field: 'target_roas'
        })
      }
    })
  }

  // 3. Schedule verification
  input.phases.forEach((phase) => {
    if (!phase.startDate || !phase.endDate) {
      issues.push({
        code: 'MISSING_PHASE_DATES',
        severity: 'error',
        title: 'Tanggal fase belum lengkap',
        message: `Fase "${phase.name}" belum memiliki tanggal mulai atau tanggal selesai yang valid.`,
        phaseId: phase.id,
        field: 'start_date'
      })
    } else if (new Date(phase.startDate) > new Date(phase.endDate)) {
      issues.push({
        code: 'INVALID_DATE_RANGE',
        severity: 'error',
        title: 'Rentang tanggal tidak valid',
        message: `Fase "${phase.name}": Tanggal mulai tidak boleh melewati tanggal selesai.`,
        phaseId: phase.id,
        field: 'end_date'
      })
    }
  })

  // 4. Pre-flight checklist check
  if (input.checklistCompletedCount < 15) {
    issues.push({
      code: 'CHECKLIST_INCOMPLETE',
      severity: 'warning',
      title: 'Pre-flight checklist belum tuntas',
      message: `Baru ${input.checklistCompletedCount} dari 15 item checklist yang diselesaikan. Selesaikan semua untuk publish.`,
      field: 'checklist'
    })
  }

  const hasErrors = issues.some((i) => i.severity === 'error')
  const canPublish = !hasErrors && input.checklistCompletedCount === 15 && input.phases.length > 0

  return {
    isValid: !hasErrors,
    canPublish,
    issues
  }
}
