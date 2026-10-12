import { AnalyticsDashboard } from '@/components/block/analytics-dashboard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Analytics Dashboard | Digital Media Planner',
  description: 'Performance overview and analytics metrics.'
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Media Planner
        </Link>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Obsidian UI Analytics Block
        </span>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <AnalyticsDashboard />
      </main>
    </div>
  )
}
