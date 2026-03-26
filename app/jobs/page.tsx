'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FreelanceJob, Site, Status, SITE_LABELS, STATUS_COLORS, SITE_COLORS } from '@/lib/types'

const ALL = 'すべて'

export default function JobsPage() {
  const [jobs, setJobs] = useState<FreelanceJob[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSite, setFilterSite] = useState<string>(ALL)
  const [filterStatus, setFilterStatus] = useState<string>(ALL)

  useEffect(() => {
    supabase
      .from('freelance_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setJobs((data || []) as FreelanceJob[])
        setLoading(false)
      })
  }, [])

  const filtered = jobs.filter(j =>
    (filterSite === ALL || j.site === filterSite) &&
    (filterStatus === ALL || j.status === filterStatus)
  )

  const sites: Site[] = ['lancers', 'visasq', 'coconala', 'crowdworks', 'other']
  const statuses: Status[] = ['未応募', '応募中', '選考中', '受注', '完了', '見送り']

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">案件一覧 <span className="text-base font-normal text-gray-500">({filtered.length}件)</span></h1>
        <Link href="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          ＋ 新規追加
        </Link>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-4">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium">サイト：</span>
          <button onClick={() => setFilterSite(ALL)} className={`text-xs px-3 py-1 rounded-full ${filterSite === ALL ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{ALL}</button>
          {sites.map(s => (
            <button key={s} onClick={() => setFilterSite(s)} className={`text-xs px-3 py-1 rounded-full ${filterSite === s ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {SITE_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium">状態：</span>
          <button onClick={() => setFilterStatus(ALL)} className={`text-xs px-3 py-1 rounded-full ${filterStatus === ALL ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{ALL}</button>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-3 py-1 rounded-full ${filterStatus === s ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
          条件に合う案件がありません
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {filtered.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
              <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${SITE_COLORS[job.site]}`}>
                {SITE_LABELS[job.site]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">{job.title}</p>
                {job.applied_at && (
                  <p className="text-xs text-gray-400 mt-0.5">応募日：{job.applied_at.slice(0, 10)}</p>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[job.status]}`}>{job.status}</span>
              {job.amount ? (
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">¥{job.amount.toLocaleString()}</span>
              ) : (
                <span className="text-sm text-gray-300 whitespace-nowrap">—</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
