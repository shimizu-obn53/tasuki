'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FreelanceJob, SITE_LABELS, STATUS_COLORS, SITE_COLORS, Site, Status } from '@/lib/types'

export default function DashboardPage() {
  const [jobs, setJobs] = useState<FreelanceJob[]>([])
  const [loading, setLoading] = useState(true)

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

  const completed = jobs.filter(j => j.status === '完了')
  const active = jobs.filter(j => ['応募中', '選考中', '受注'].includes(j.status))
  const totalIncome = completed.reduce((sum, j) => sum + (j.amount || 0), 0)

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthlyIncome = completed
    .filter(j => j.completed_at?.startsWith(thisMonth))
    .reduce((sum, j) => sum + (j.amount || 0), 0)

  const statuses: Status[] = ['応募中', '選考中', '受注', '完了', '見送り']
  const statsByStatus = statuses.map(s => ({
    status: s,
    count: jobs.filter(j => j.status === s).length,
  }))

  const recentJobs = jobs.slice(0, 5)

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">今月の収入</p>
          <p className="text-2xl font-bold text-blue-600">¥{monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">累計収入</p>
          <p className="text-2xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">進行中案件</p>
          <p className="text-2xl font-bold text-purple-600">{active.length}件</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">完了案件</p>
          <p className="text-2xl font-bold text-gray-700">{completed.length}件</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-4">ステータス別</h2>
        <div className="flex flex-wrap gap-3">
          {statsByStatus.map(({ status, count }) => (
            <div key={status} className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}>
              {status}：{count}件
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">最近の案件</h2>
          <Link href="/jobs" className="text-sm text-blue-500 hover:underline">すべて見る →</Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">
            <p>案件がまだありません</p>
            <Link href="/jobs/new" className="mt-3 inline-block text-blue-500 hover:underline text-sm">
              最初の案件を追加する
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentJobs.map(job => (
              <li key={job.id}>
                <Link href={`/jobs/${job.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${SITE_COLORS[job.site]}`}>
                    {SITE_LABELS[job.site]}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800 truncate">{job.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                  {job.amount && (
                    <span className="text-sm text-gray-600 font-medium">¥{job.amount.toLocaleString()}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
