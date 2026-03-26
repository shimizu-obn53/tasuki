'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/lib/supabase'
import ImageUpload from '@/app/components/ImageUpload'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''

function EditListingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState<Partial<Listing>>({})

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/admin/login')
        return
      }
      if (!id) { router.push('/admin'); return }

      const { data } = await supabase.from('listings').select('*').eq('id', id).single<Listing>()
      if (!data) { router.push('/admin'); return }
      setForm(data)
      setLoading(false)
    }
    init()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    setSaveMsg('')

    const { error } = await supabase.from('listings').update({
      type: form.type,
      title: form.title,
      prefecture: form.prefecture,
      city: form.city,
      price: form.price ? Number(form.price) : 0,
      monthly_revenue: form.monthly_revenue ? Number(form.monthly_revenue) : null,
      years_in_business: form.years_in_business ? Number(form.years_in_business) : null,
      staff_count: form.staff_count ? Number(form.staff_count) : null,
      reason: form.reason,
      transfer_timing: form.transfer_timing,
      description: form.description,
      owner_name: form.owner_name,
      owner_age: form.owner_age ? Number(form.owner_age) : null,
      email: form.email,
      phone: form.phone,
      status: form.status,
    }).eq('id', id)

    setSaving(false)
    if (error) {
      setSaveMsg('保存に失敗しました。')
    } else {
      setSaveMsg('保存しました ✓')
      setTimeout(() => { setSaveMsg(''); router.push('/admin') }, 1500)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">読み込み中...</div>

  const field = (label: string, name: keyof Listing, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={(form[name] as string) ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">← 管理画面に戻る</Link>
        <h1 className="text-xl font-bold text-gray-800">掲載情報を編集</h1>
      </div>

      <div className="space-y-6">
        {/* ステータス */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-4">ステータス</h2>
          <select
            name="status"
            value={form.status ?? ''}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {['審査中', '公開中', '商談中', '成約済み', '取り下げ'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* 店舗情報 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-4">店舗情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">業種</label>
              <select
                name="type"
                value={form.type ?? ''}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="美容院">美容院</option>
                <option value="整骨院">整骨院</option>
              </select>
            </div>
            {field('タイトル（表示名）', 'title', 'text', '例：大阪市 美容室〇〇')}
            <div className="grid grid-cols-2 gap-4">
              {field('都道府県', 'prefecture', 'text', '例：大阪府')}
              {field('市区町村', 'city', 'text', '例：大阪市北区')}
            </div>
          </div>
        </div>

        {/* 事業情報 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-4">事業情報</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {field('譲渡希望金額（万円）', 'price', 'number', '100')}
            {field('月商（万円）', 'monthly_revenue', 'number', '80')}
            {field('創業年数', 'years_in_business', 'number', '15')}
            {field('スタッフ数', 'staff_count', 'number', '3')}
          </div>
          <div className="space-y-4">
            {field('譲渡理由', 'reason', 'text', '高齢のため')}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">譲渡希望時期</label>
              <select
                name="transfer_timing"
                value={form.transfer_timing ?? ''}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">選択してください</option>
                {['即時（すぐにでも）', '3ヶ月以内', '6ヶ月以内', '1年以内', '1〜2年以内', '時期は相談可能'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">お店の説明</label>
              <textarea
                name="description"
                value={form.description ?? ''}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* オーナー情報 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-1">オーナー情報（非公開）</h2>
          <p className="text-xs text-gray-400 mb-4">年配の方の代わりに管理者が入力できます</p>
          <div className="grid grid-cols-2 gap-4">
            {field('お名前', 'owner_name', 'text', '山田 太郎')}
            {field('年齢', 'owner_age', 'number', '65')}
            {field('メールアドレス', 'email', 'email', 'yamada@example.com')}
            {field('電話番号', 'phone', 'tel', '090-1234-5678')}
          </div>
        </div>

        {/* 写真管理 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-1">写真</h2>
          <p className="text-xs text-gray-400 mb-4">最大5枚。1枚目がメイン写真になります。</p>
          <ImageUpload
            listingId={form.id ?? ''}
            images={form.images ?? []}
            onUpdate={(newImages) => setForm({ ...form, images: newImages })}
          />
        </div>

        {saveMsg && (
          <p className={`text-center font-medium ${saveMsg.includes('失敗') ? 'text-red-600' : 'text-green-600'}`}>
            {saveMsg}
          </p>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          <Link
            href="/admin"
            className="border border-gray-200 text-gray-500 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-center"
          >
            キャンセル
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminEditListing() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">読み込み中...</div>}>
      <EditListingContent />
    </Suspense>
  )
}
