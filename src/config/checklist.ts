// checklist.ts
export interface ChecklistDefinition {
  key: number
  label: string
  category: string
}

export const PREFLIGHT_CHECKLIST: ChecklistDefinition[] = [
  { key: 1, label: 'Objective di platform = objective di brief & media plan', category: 'Alignment' },
  { key: 2, label: 'Struktur campaign / ad set / ad mengikuti naming convention', category: 'Structure' },
  { key: 3, label: 'Audience antar ad set tidak tumpang tindih; exclusion dipasang', category: 'Targeting' },
  { key: 4, label: 'Placement dipilih sadar, bukan default semua penempatan', category: 'Placement' },
  { key: 5, label: 'Budget harian × hari = budget fase; persentase = 100%', category: 'Budget' },
  { key: 6, label: 'Tanggal mulai, selesai, dayparting terisi di zona waktu benar', category: 'Schedule' },
  { key: 7, label: 'Bidding strategy dan batas sesuai media plan', category: 'Bidding' },
  { key: 8, label: 'Kreatif lolos spesifikasi: dimensi, durasi, ukuran, teks, safe zone', category: 'Creative' },
  { key: 9, label: 'Headline, deskripsi, CTA sesuai pesan utama dan bebas salah ketik', category: 'Creative' },
  { key: 10, label: 'URL landing page hidup, cepat di ponsel, dan ber-UTM', category: 'Technical' },
  { key: 11, label: 'Pixel / conversion event terpasang dan diuji', category: 'Technical' },
  { key: 12, label: 'Brand safety: inventory filter dan exclusion list aktif', category: 'Governance' },
  { key: 13, label: 'Targeting diperiksa terhadap praktik diskriminatif', category: 'Governance' },
  { key: 14, label: 'Akun pembayaran aktif dengan limit mencukupi', category: 'Finance' },
  { key: 15, label: 'Klien / supervisor menyetujui brief dan media plan', category: 'Sign-off' }
]
