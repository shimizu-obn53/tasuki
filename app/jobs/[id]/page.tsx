'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FreelanceJob, FreelanceApplication, Site, Status, SITE_LABELS, STATUS_COLORS, SITE_COLORS } from '@/lib/types'

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<FreelanceJob | null>(null)
  const [apps, setApps] = useState<FreelanceApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<FreelanceJob>>({})
  const [newApp, setNewApp] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('freelance_jobs').select('*').eq('id', id).single(),
      supabase.from('freelance_applications').select('*').eq('job_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: j }, { data: a }]) => {
      setJob(j as FreelanceJob)
      setEditForm(j as FreelanceJob)
      setApps((a || []) as FreelanceApplication[])
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const { data } = await supabase
      .from('freelance_jobs')
      .update(editForm)
      .eq('id', id)
      .select()
      .single()
    setJob(data as FreelanceJob)
    setEditing(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('この案件を削除しますか？')) return
    await supabase.from('freelance_jobs').delete().eq('id', id)
    router.push('/jobs')
  }

  const handleAddApp = async () => {
    if (!newApp.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('freelance_applications')
      .insert({ job_id: id, content: newApp })
      .select()
      .single()
    setApps(prev => [data as FreelanceApplication, ...prev])
    setNewApp('')
    setSaving(false)
  }

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('この応募文を削除しますか？')) return
    await supabase.from('freelance_applications').delete().eq('id', appId)
    setApps(prev => prev.filter(a => a.id !== appId))
  }

  const handleStatusChange = async (status: Status) => {
    const update: Partial<FreelanceJob> = { status }
    if (status === '完了') update.completed_at = new Date().toISOString()
    await supabase.from('freelance_jobs').update(update).eq('id', id)
    setJob(prev => prev ? { ...prev, ...update } : null)
    setEditForm(prev => ({ ...prev, ...update }))
  }

  const sites: Site[] = ['lancers', 'visasq', 'coconala', 'crowdworks', 'other']
  const statuses: Status[] = ['未応募', '応募中', '選考中', '受注', '完了', '見送り']

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>
  if (!job) return <div className="text-center py-20 text-gray-400">案件が見つかりません</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/jobs" className="hover:text-blue-500">案件一覧</Link>
        <span>/</span>
        <span className="truncate text-gray-700">{job.title}</span>
      </div>

      {/* 案件情報 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${SITE_COLORS[job.site]}`}>{SITE_LABELS[job.site]}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[job.status]}`}>{job.status}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(!editing)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              {editing ? 'キャンセル' : '編集'}
            </button>
            <button onClick={handleDelete} className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500">
              削除
            </button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">タイトル</label>
              <input value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">サイト</label>
              <div className="flex flex-wrap gap-2">
                {sites.map(s => (
                  <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, site: s }))}
                    className={`px-3 py-1 rounded-lg text-xs border ${editForm.site === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200'}`}>
                    {SITE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">URL</label>
              <input value={editForm.url || ''} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">報酬（円）</label>
                <input type="number" value={editForm.amount || ''} onChange={e => setEditForm(f => ({ ...f, amount: parseInt(e.target.value) || null }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ステータス</label>
                <select value={editForm.status || ''} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as Status }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">メモ</label>
              <textarea value={editForm.notes || ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h1 className="text-lg font-bold text-gray-800">{job.title}</h1>
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline break-all">{job.url}</a>
            )}
            <div className="flex gap-6 text-sm text-gray-600 pt-1">
              {job.amount && <span className="font-semibold text-green-700">¥{job.amount.toLocaleString()}</span>}
              {job.applied_at && <span>応募日：{job.applied_at.slice(0, 10)}</span>}
              {job.completed_at && <span>完了日：{job.completed_at.slice(0, 10)}</span>}
            </div>
            {job.notes && <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{job.notes}</p>}
          </div>
        )}

        {/* クイックステータス変更 */}
        {!editing && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">ステータスを変更：</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${job.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 応募文 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700 border-b pb-2">応募文</h2>

        <div className="space-y-2">
          <textarea value={newApp} onChange={e => setNewApp(e.target.value)}
            rows={6}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono"
            placeholder="応募文を追加する..." />
          <button onClick={handleAddApp} disabled={saving || !newApp.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
            保存
          </button>
        </div>

        {apps.length > 0 && (
          <div className="space-y-3 mt-2">
            {apps.map(app => (
              <div key={app.id} className="bg-gray-50 rounded-lg p-4 relative">
                <p className="text-xs text-gray-400 mb-2">{app.created_at.slice(0, 10)}</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{app.content}</pre>
                <button onClick={() => handleDeleteApp(app.id)}
                  className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-600">削除</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
