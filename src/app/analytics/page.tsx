import Link from 'next/link'
import { ArrowLeft, Eye, MousePointerClick, ShoppingCart, Target, ChartNoAxesCombined } from 'lucide-react'

export const metadata = {
  title: 'Campaign Analytics | NARAVA Media Planner',
  description: 'Panduan metrik untuk mengevaluasi performa campaign awareness, traffic, dan conversion.'
}

const metricGroups = [
  {
    title: 'Awareness',
    description: 'Ukur seberapa luas pesan campaign menjangkau audiens.',
    icon: Eye,
    tone: 'pink',
    metrics: [
      ['Reach', 'Jumlah akun unik yang melihat iklan.'],
      ['Impressions', 'Total berapa kali iklan ditampilkan.'],
      ['CPM', 'Biaya per 1.000 impressions.']
    ]
  },
  {
    title: 'Traffic',
    description: 'Lihat apakah audiens tertarik untuk mencari tahu lebih lanjut.',
    icon: MousePointerClick,
    tone: 'blue',
    metrics: [
      ['Link clicks', 'Jumlah klik menuju halaman tujuan.'],
      ['CTR', 'Persentase impressions yang menghasilkan klik.'],
      ['CPC', 'Biaya rata-rata untuk setiap klik.']
    ]
  },
  {
    title: 'Conversion',
    description: 'Evaluasi kontribusi campaign terhadap hasil bisnis.',
    icon: ShoppingCart,
    tone: 'pink',
    metrics: [
      ['Conversions', 'Jumlah aksi yang dianggap sebagai hasil.'],
      ['CPA', 'Biaya rata-rata untuk satu conversion.'],
      ['ROAS', 'Pendapatan yang dihasilkan dibanding biaya iklan.']
    ]
  }
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#fff8fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-pink-600">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Media Planner
          </Link>
          <span className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-pink-700">NARAVA · ANALYTICS</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-pink-100/70 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute right-28 -bottom-24 h-48 w-48 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"><ChartNoAxesCombined className="h-3.5 w-3.5" /> Campaign measurement</span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Ukur hasil, bukan hanya aktivitas.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Gunakan metrik yang sesuai dengan tujuan tiap fase. Halaman ini adalah panduan KPI; data iklan belum terhubung secara otomatis dari Meta Ads atau TikTok Ads.</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-pink-600"><Eye className="h-4 w-4" /><span className="text-sm font-semibold">Awareness</span></div><p className="mt-3 text-sm text-slate-600">Reach, impressions, CPM</p><p className="mt-1 text-xs text-slate-400">Fokus: jangkauan dan efisiensi exposure</p></div>
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-blue-600"><MousePointerClick className="h-4 w-4" /><span className="text-sm font-semibold">Traffic</span></div><p className="mt-3 text-sm text-slate-600">Clicks, CTR, CPC</p><p className="mt-1 text-xs text-slate-400">Fokus: ketertarikan dan kunjungan</p></div>
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-pink-600"><Target className="h-4 w-4" /><span className="text-sm font-semibold">Conversion</span></div><p className="mt-3 text-sm text-slate-600">Conversions, CPA, ROAS</p><p className="mt-1 text-xs text-slate-400">Fokus: hasil bisnis dan profitabilitas</p></div>
        </section>

        <section className="space-y-4">
          <div><h2 className="text-lg font-bold tracking-tight">KPI yang perlu dipantau</h2><p className="mt-1 text-sm text-slate-500">Pilih metrik utama berdasarkan objective di media plan kamu.</p></div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {metricGroups.map((group) => {
              const Icon = group.icon
              const iconClass = group.tone === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
              return (
                <article key={group.title} className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3"><span className={`rounded-xl p-2.5 ${iconClass}`}><Icon className="h-5 w-5" /></span><div><h3 className="font-semibold">{group.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{group.description}</p></div></div>
                  <div className="mt-4 divide-y divide-pink-50">
                    {group.metrics.map(([name, description]) => <div key={name} className="py-3"><p className="text-sm font-semibold text-slate-800">{name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>)}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <div className="flex items-start gap-3"><span className="rounded-xl bg-white p-2 text-blue-600"><Target className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-900">Sebelum membaca performa</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">Tetapkan baseline dan target KPI sebelum campaign berjalan. Bandingkan hasil aktual dengan target, periksa rentang tanggal yang sama, lalu optimalkan budget berdasarkan metrik yang paling dekat dengan tujuan bisnis.</p><Link href="/" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-pink-600">Kembali ke perencanaan campaign <ArrowLeft className="h-4 w-4 rotate-180" /></Link></div></div>
        </section>
      </main>
    </div>
  )
}
