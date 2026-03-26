'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FreelanceJob, Site, SITE_LABELS } from '@/lib/types'

export default function IncomePage() {
  const [jobs, setJobs] = useState<FreelanceJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('freelance_jobs')
      .select('*')
      .eq('status', '完了')
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        setJobs((data || []) as FreelanceJob[])
        setLoading(false)
      })
  }, [])

  // 月別集計
  const byMonth: Record<string, number> = {}
  jobs.forEach(j => {
    const month = (j.completed_at || j.created_at).slice(0, 7)
    byMonth[month] = (byMonth[month] || 0) + (j.amount || 0)
  })
  const months = Object.keys(byMonth).sort().reverse().slice(0, 6)

  // サイト別集計
  const bySite: Partial<Record<Site, number>> = {}
  jobs.forEach(j => {
    bySite[j.site] = (bySite[j.site] || 0) + (j.amount || 0)
  })

  const totalIncome = jobs.reduce((sum, j) => sum + (j.amount || 0), 0)
  const maxMonthly = Math.max(...months.map(m => byMonth[m]), 1)

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">収入トラッキング</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">累計収入</p>
          <p className="text-3xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">完了案件数</p>
          <p className="text-3xl font-bold text-gray-700">{jobs.length}件</p>
        </div>
      </div>

      {/* 月別グラフ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-5">月別収入（直近6ヶ月）</h2>
        {months.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">完了した案件がまだありません</p>
        ) : (
          <div className="space-y-3">
            {months.map(m => (
              <div key={m} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 shrink-0">{m}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-green-500 h-6 rounded-full transition-all"
                    style={{ width: `${(byMonth[m] / maxMonthly) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-24 text-right">¥{byMonth[m].toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* サイト別 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">サイト別収入</h2>
        {Object.keys(bySite).length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">データがありません</p>
        ) : (
          <div className="space-y-3">
            {(Object.entries(bySite) as [Site, number][]).sort((a, b) => b[1] - a[1]).map(([site, amount]) => (
              <div key={site} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{SITE_LABELS[site]}</span>
                <span className="font-medium text-gray-800">¥{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 案件一覧（完了済み） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-700 px-6 py-4 border-b border-gray-100">完了案件一覧</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">完了した案件がありません</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.map(j => (
              <div key={j.id} className="flex items-center gap-4 px-6 py-3">
                <span className="text-xs text-gray-400 w-20 shrink-0">{(j.completed_at || j.created_at).slice(0, 10)}</span>
                <span className="flex-1 text-sm text-gray-700 truncate">{j.title}</span>
                <span className="text-xs text-gray-500">{SITE_LABELS[j.site]}</span>
                <span className="text-sm font-medium text-green-700 w-24 text-right">
                  {j.amount ? `¥${j.amount.toLocaleString()}` : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
