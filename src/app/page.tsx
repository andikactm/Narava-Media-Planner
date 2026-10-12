'use client'

import { useState, useId } from 'react'
import { 
  Calculator, 
  CheckCircle2, 
  AlertCircle,
  Plus, 
  Trash2,
  FileSpreadsheet,
  CheckSquare,
  Wallet,
  CalendarDays,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react'
import { 
  calculateAwarenessBudget, 
  calculateTrafficBudget, 
  calculateConversionBudget, 
  calculateBreakEvenCPA, 
  calculateBreakEvenROAS, 
  evaluateCPAFence 
} from '@/lib/campaign/calculations'
import { validateCampaign } from '@/lib/campaign/validation'
import { PREFLIGHT_CHECKLIST } from '@/config/checklist'

interface PhaseItem {
  id: string
  name: string
  objective: 'Awareness' | 'Traffic' | 'Conversion'
  channel: string
  format: string
  budget: number
  budgetPercentage: number
  startDate: string
  endDate: string
  targetCpa?: number
  targetRoas?: number
}

export default function MediaPlannerApp() {
  const priceInputId = useId()
  const marginInputId = useId()
  const budgetInputId = useId()

  // Campaign Meta State
  const [campaignName, setCampaignName] = useState('Peluncuran Produk Q4')
  const [brandName, setBrandName] = useState('Brand Lokal')
  const [totalBudget, setTotalBudget] = useState<number>(50000000)
  const [productPrice, setProductPrice] = useState<number>(185000)
  const [marginPercent, setMarginPercent] = useState<number>(45)
  
  // Phases State
  const [phases, setPhases] = useState<PhaseItem[]>([
    {
      id: 'p1',
      name: 'Fase 1: Top of Funnel',
      objective: 'Awareness',
      channel: 'Instagram',
      format: 'Reels Video',
      budget: 15000000,
      budgetPercentage: 30,
      startDate: '2026-11-01',
      endDate: '2026-11-07'
    },
    {
      id: 'p2',
      name: 'Fase 2: Traffic & Consideration',
      objective: 'Traffic',
      channel: 'TikTok',
      format: 'In-Feed Ad',
      budget: 15000000,
      budgetPercentage: 30,
      startDate: '2026-11-08',
      endDate: '2026-11-14'
    },
    {
      id: 'p3',
      name: 'Fase 3: Direct Conversion',
      objective: 'Conversion',
      channel: 'Meta Ads',
      format: 'Carousel Feed',
      budget: 20000000,
      budgetPercentage: 40,
      startDate: '2026-11-15',
      endDate: '2026-11-21',
      targetCpa: 65000
    }
  ])

  // Checklist State
  const [completedChecks, setCompletedChecks] = useState<number[]>([1, 2, 3, 4, 6])
  const [checklistFilter, setChecklistFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL')

  // Financial Calculations
  const marginDecimal = (marginPercent || 0) / 100
  const breakEvenCPA = calculateBreakEvenCPA({ productPrice, margin: marginDecimal })
  const breakEvenROAS = calculateBreakEvenROAS({ margin: marginDecimal })

  // Active validation check
  const validationResult = validateCampaign({
    totalBudget,
    phases,
    productPrice,
    margin: marginDecimal,
    checklistCompletedCount: completedChecks.length
  })

  // Handlers
  const toggleCheck = (key: number) => {
    setCompletedChecks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleAddPhase = () => {
    const newPhase: PhaseItem = {
      id: `p-${Date.now()}`,
      name: `Fase ${phases.length + 1}`,
      objective: 'Traffic',
      channel: 'Meta Ads',
      format: 'Single Image',
      budget: 0,
      budgetPercentage: 0,
      startDate: '2026-11-01',
      endDate: '2026-11-07'
    }
    setPhases([...phases, newPhase])
  }

  const handleRemovePhase = (id: string) => {
    setPhases(phases.filter((p) => p.id !== id))
  }

  const handleUpdatePhase = (id: string, field: keyof PhaseItem, val: any) => {
    setPhases(
      phases.map((p) => {
        if (p.id !== id) return p
        const updated = { ...p, [field]: val }
        if (field === 'budget' && totalBudget > 0) {
          updated.budgetPercentage = Number(((Number(val) / totalBudget) * 100).toFixed(1))
        }
        return updated
      })
    )
  }

  const allocatedBudget = phases.reduce((sum, phase) => sum + Math.max(0, Number(phase.budget) || 0), 0)
  const remainingBudget = totalBudget - allocatedBudget
  const budgetUsage = totalBudget > 0 ? Math.min(100, Math.round((allocatedBudget / totalBudget) * 100)) : 0
  const formatCurrency = (value: number) => `Rp${Math.abs(value).toLocaleString('id-ID')}`

  const filteredChecklist = PREFLIGHT_CHECKLIST.filter((item) => {
    const isDone = completedChecks.includes(item.key)
    if (checklistFilter === 'DONE') return isDone
    if (checklistFilter === 'PENDING') return !isDone
    return true
  })

  return (
    <div className="min-h-screen bg-[#fff8fc] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-pink-100 bg-white/95 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-slate-900">NARAVA Media Planner</span>
            <span className="text-xs bg-pink-50 text-slate-500 border border-pink-200 px-2 py-0.5 rounded font-mono">
              v1.0 MVP
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-slate-500">
              Campaign: <span className="text-slate-700 font-medium">{campaignName}</span> ({brandName})
            </p>
            <span className="text-slate-500 text-xs">•</span>
            <a 
              href="/analytics" 
              className="text-xs text-pink-600 hover:text-blue-600 underline underline-offset-2 transition"
            >
              Lihat Analytics Dashboard →
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`text-xs px-2.5 py-1 rounded font-semibold border ${
            validationResult.canPublish 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-pink-50 border-pink-200 text-slate-500'
          }`}>
            {validationResult.canPublish ? 'STATUS: READY TO PUBLISH' : 'STATUS: PLANNING'}
          </div>

          <button 
            disabled={!validationResult.canPublish}
            className={`text-xs font-semibold px-4 py-2 rounded transition flex items-center gap-1.5 ${
              validationResult.canPublish
                ? 'bg-pink-600 hover:bg-pink-700 text-white cursor-pointer'
                : 'bg-pink-50 text-slate-500 border border-pink-200 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Finalize Plan
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
<section className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 sm:p-7 shadow-sm">
<div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-pink-100/70 blur-3xl" />
<div aria-hidden="true" className="pointer-events-none absolute right-24 -bottom-24 h-48 w-48 rounded-full bg-blue-100/80 blur-3xl" />
<div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
<div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-700"><span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> NARAVA · Workspace</span>
<h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Rencanakan campaign dengan lebih terarah.</h1>
<p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Atur budget, susun fase distribusi, dan cek kesiapan campaign dalam satu workspace.</p></div>
<div className="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 sm:min-w-48"><p className="text-xs font-medium text-blue-700">Kesiapan campaign</p><p className="mt-1 text-lg font-bold text-slate-900">{validationResult.canPublish ? "Siap ditinjau" : "Dalam perencanaan"}</p><p className="mt-1 text-xs text-slate-500">{completedChecks.length} dari 15 checklist selesai</p></div>
</div></section>
<section aria-label="Ringkasan campaign" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
<div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-slate-500">Total budget</span><span className="rounded-lg bg-pink-50 p-2 text-pink-600"><Wallet className="h-4 w-4" /></span></div><p className="mt-3 break-words text-xl font-bold tracking-tight text-slate-900">{formatCurrency(totalBudget)}</p><p className="mt-1 text-xs text-slate-500">Anggaran campaign</p></div>
<div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-slate-500">Sudah dialokasikan</span><span className="rounded-lg bg-blue-50 p-2 text-blue-600"><TrendingUp className="h-4 w-4" /></span></div><p className="mt-3 break-words text-xl font-bold tracking-tight text-slate-900">{formatCurrency(allocatedBudget)}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-50"><div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${budgetUsage}%` }} /></div><p className="mt-1.5 text-xs text-slate-500">{budgetUsage}% dari total budget</p></div>
<div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-slate-500">Sisa anggaran</span><span className="rounded-lg bg-pink-50 p-2 text-pink-600"><ArrowUpRight className="h-4 w-4" /></span></div><p className={`mt-3 break-words text-xl font-bold tracking-tight ${remainingBudget < 0 ? "text-rose-600" : "text-slate-900"}`}>{remainingBudget < 0 ? "-" : ""}{formatCurrency(remainingBudget)}</p><p className="mt-1 text-xs text-slate-500">{remainingBudget < 0 ? "Melebihi budget campaign" : "Belum dialokasikan ke fase"}</p></div>
<div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-slate-500">Jumlah fase</span><span className="rounded-lg bg-blue-50 p-2 text-blue-600"><CalendarDays className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-bold tracking-tight text-slate-900">{phases.length} <span className="text-sm font-medium text-slate-500">fase</span></p><p className="mt-1 text-xs text-slate-500">Distribusi media campaign</p></div>
</section>
        
        {/* Row 1: Campaign Financials & Break-Even Constraints */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white border border-pink-100 p-5 rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-slate-500" /> Parameter Bisnis & Budget
            </h2>
            
            <div className="space-y-2">
              <div>
                <label htmlFor={budgetInputId} className="text-xs text-slate-500 block mb-1">Total Budget Campaign (Rp)</label>
                <input 
                  id={budgetInputId}
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full rounded-lg border border-pink-200 bg-[#fff8fc] px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={priceInputId} className="text-xs text-slate-500 block mb-1">Harga Produk (Rp)</label>
                  <input 
                    id={priceInputId}
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full bg-[#fff8fc] border border-pink-200 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-pink-400 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor={marginInputId} className="text-xs text-slate-500 block mb-1">Margin (%)</label>
                  <input 
                    id={marginInputId}
                    type="number"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(Number(e.target.value))}
                    className="w-full bg-[#fff8fc] border border-pink-200 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-pink-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-pink-100 p-4 rounded-lg space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Batas Break-Even Finansial
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-pink-100">
                <span className="text-slate-500">Break-Even CPA:</span>
                <span className="font-mono text-sm text-slate-900 font-semibold">Rp{breakEvenCPA.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-pink-100">
                <span className="text-slate-500">Break-Even ROAS:</span>
                <span className="font-mono text-sm text-slate-900 font-semibold">{breakEvenROAS}x</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Target CPA fase conversion dilarang melampaui Rp{breakEvenCPA.toLocaleString('id-ID')} agar transaksi tidak rugi.
              </div>
            </div>
          </div>

          <div className="bg-white border border-pink-100 p-4 rounded-lg space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Status Validasi Deterministic
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Isu:</span>
                <span className={`font-mono font-bold ${validationResult.issues.length === 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                  {validationResult.issues.length} catatan
                </span>
              </div>

              {validationResult.issues.length === 0 ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded text-xs text-blue-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Semua perhitungan budget dan batas aman valid.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {validationResult.issues.map((issue, idx) => (
                    <div 
                      key={idx}
                      className={`text-[11px] p-2 rounded border flex items-start gap-1.5 ${
                        issue.severity === 'error'
                          ? 'bg-pink-50 border-pink-200 text-pink-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </section>

        {/* Row 2: Media Plan Phase Builder */}
        <section className="bg-white border border-pink-100 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                Matriks Media Plan per Fase
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi 9 parameter setup: Channel, Format, Objective, Schedule, Bidding, dan Target KPI.
              </p>
            </div>
            <button 
              onClick={handleAddPhase}
              className="text-xs bg-pink-600 hover:bg-pink-700 text-white border border-pink-600 px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Fase
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-pink-100">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-pink-100 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Nama Fase</th>
                  <th className="py-2.5 px-3">Objective</th>
                  <th className="py-2.5 px-3">Platform & Format</th>
                  <th className="py-2.5 px-3">Jadwal (Mulai - Selesai)</th>
                  <th className="py-2.5 px-3">Alokasi Budget (Rp)</th>
                  <th className="py-2.5 px-3">Target CPA</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {phases.map((phase) => {
                  const cpaFence = phase.targetCpa ? evaluateCPAFence(phase.targetCpa, breakEvenCPA) : null
                  
                  return (
                    <tr key={phase.id} className="hover:bg-pink-50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        <input 
                          type="text" 
                          value={phase.name} 
                          onChange={(e) => handleUpdatePhase(phase.id, 'name', e.target.value)}
                          className="w-36 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-900 outline-none transition hover:border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <select 
                          value={phase.objective} 
                          onChange={(e) => handleUpdatePhase(phase.id, 'objective', e.target.value)}
                          className="rounded-lg border border-pink-100 bg-[#fff8fc] px-2.5 py-2 text-slate-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                        >
                          <option value="Awareness">Awareness</option>
                          <option value="Traffic">Traffic</option>
                          <option value="Conversion">Conversion</option>
                        </select>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex gap-1.5">
                          <input 
                            type="text"
                            value={phase.channel}
                            onChange={(e) => handleUpdatePhase(phase.id, 'channel', e.target.value)}
                            className="w-24 rounded-lg border border-pink-100 bg-[#fff8fc] px-2.5 py-2 text-slate-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                            placeholder="Channel"
                          />
                          <input 
                            type="text"
                            value={phase.format}
                            onChange={(e) => handleUpdatePhase(phase.id, 'format', e.target.value)}
                            className="w-28 rounded-lg border border-pink-100 bg-[#fff8fc] px-2.5 py-2 text-slate-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                            placeholder="Format"
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <input 
                            type="date"
                            value={phase.startDate}
                            onChange={(e) => handleUpdatePhase(phase.id, 'startDate', e.target.value)}
                            className="rounded-lg border border-pink-100 bg-[#fff8fc] px-2 py-2 text-slate-700 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                          />
                          <span className="text-slate-500">-</span>
                          <input 
                            type="date"
                            value={phase.endDate}
                            onChange={(e) => handleUpdatePhase(phase.id, 'endDate', e.target.value)}
                            className="bg-[#fff8fc] border border-pink-100 rounded px-1.5 py-1 text-slate-700 focus:outline-none"
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number"
                            value={phase.budget}
                            onChange={(e) => handleUpdatePhase(phase.id, 'budget', Number(e.target.value))}
                            className="bg-[#fff8fc] border border-pink-100 rounded px-2 py-1 text-slate-700 w-28 focus:outline-none"
                          />
                          <span className="text-slate-500 text-[11px]">
                            ({phase.budgetPercentage}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        {phase.objective === 'Conversion' ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              value={phase.targetCpa || 0}
                              onChange={(e) => handleUpdatePhase(phase.id, 'targetCpa', Number(e.target.value))}
                              className="bg-[#fff8fc] border border-pink-100 rounded px-2 py-1 text-slate-700 w-24 focus:outline-none"
                            />
                            {cpaFence && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                cpaFence.status === 'SAFE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                cpaFence.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-pink-50 text-pink-700 border-pink-200'
                              }`}>
                                {cpaFence.status}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button 
                          onClick={() => handleRemovePhase(phase.id)}
                          className="text-slate-500 hover:text-pink-600 transition p-1"
                          title="Hapus fase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Row 3: Pre-Flight Checklist */}
        <section className="bg-white border border-pink-100 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                15 Pre-flight Quality Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Progres: <span className="text-slate-900 font-mono">{completedChecks.length}</span> dari 15 item selesai.
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
              <button 
                onClick={() => setChecklistFilter('ALL')}
                className={`px-2.5 py-1 rounded transition ${checklistFilter === 'ALL' ? 'bg-pink-50 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setChecklistFilter('PENDING')}
                className={`px-2.5 py-1 rounded transition ${checklistFilter === 'PENDING' ? 'bg-pink-50 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Belum ({15 - completedChecks.length})
              </button>
              <button 
                onClick={() => setChecklistFilter('DONE')}
                className={`px-2.5 py-1 rounded transition ${checklistFilter === 'DONE' ? 'bg-pink-50 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Selesai ({completedChecks.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredChecklist.map((item) => {
              const isDone = completedChecks.includes(item.key)
              return (
                <div 
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleCheck(item.key) } }}
                  role="checkbox"
                  aria-checked={isDone}
                  tabIndex={0}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
                    isDone 
                      ? 'bg-[#fff8fc]/70 border-pink-200 text-slate-500' 
                      : 'bg-[#fff8fc]/30 border-pink-100 text-slate-500 hover:border-pink-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={isDone}
                    onChange={() => toggleCheck(item.key)}
                    onClick={(event) => event.stopPropagation()}
                    className="mt-0.5 rounded border-pink-200 text-pink-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">
                      #{item.key} {item.category}
                    </span>
                    <p className="mt-0.5 leading-snug">{item.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
