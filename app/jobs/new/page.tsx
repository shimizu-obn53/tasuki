'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Site, Status, SITE_LABELS } from '@/lib/types'

export default function NewJobPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    site: 'lancers' as Site,
    title: '',
    url: '',
    amount: '',
    status: '応募中' as Status,
    applied_at: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [appText, setAppText] = useState('')

  const sites: Site[] = ['lancers', 'visasq', 'coconala', 'crowdworks', 'other']
  const statuses: Status[] = ['未応募', '応募中', '選考中', '受注', '完了', '見送り']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data, error } = await supabase
      .from('freelance_jobs')
      .insert({
        site: form.site,
        title: form.title,
        url: form.url || null,
        amount: form.amount ? parseInt(form.amount) : null,
        status: form.status,
        applied_at: form.applied_at ? new Date(form.applied_at).toISOString() : null,
        notes: form.notes || null,
      })
      .select()
      .single()

    if (error) {
      alert('保存に失敗しました: ' + error.message)
      setSaving(false)
      return
    }

    if (appText && data) {
      await supabase.from('freelance_applications').insert({
        job_id: data.id,
        content: appText,
      })
    }

    router.push(`/jobs/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">新規案件を追加</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 border-b pb-2">基本情報</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">サイト</label>
            <div className="flex flex-wrap gap-2">
              {sites.map(s => (
                <button key={s} type="button"
                  onClick={() => setForm(f => ({ ...f, site: s }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.site === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}>
                  {SITE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">案件タイトル <span className="text-red-500">*</span></label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="例：【1記事3,000円】ITエンジニア・転職に関する記事作成" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">案件URL</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">報酬（円）</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="3000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">応募日</label>
              <input type="date" value={form.applied_at} onChange={e => setForm(f => ({ ...f, applied_at: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ステータス</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button key={s} type="button"
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.status === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">メモ</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="締切・条件・気になる点など" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700 border-b pb-2">応募文（任意）</h2>
          <textarea value={appText} onChange={e => setAppText(e.target.value)}
            rows={8}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono"
            placeholder="応募文をここに貼り付けておくと後から参照できます" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? '保存中...' : '保存する'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
