'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    type: '',
    name: '',
    prefecture: '',
    city: '',
    price: '',
    monthlyRevenue: '',
    years: '',
    reason: '',
    transferTiming: '',
    description: '',
    ownerName: '',
    email: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('listings').insert({
      type: form.type,
      title: form.name ? `${form.prefecture} ${form.name}` : `${form.prefecture} ${form.type}`,
      prefecture: form.prefecture,
      city: form.city,
      price: parseInt(form.price),
      monthly_revenue: form.monthlyRevenue ? parseInt(form.monthlyRevenue) : null,
      years_in_business: form.years ? parseInt(form.years) : null,
      reason: form.reason,
      transfer_timing: form.transferTiming || null,
      description: form.description,
      owner_name: form.ownerName,
      email: form.email,
      phone: form.phone,
      status: '審査中',
    })

    setLoading(false)

    if (error) {
      setError('送信に失敗しました。もう一度お試しください。')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">ご登録ありがとうございます</h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          内容を確認後、2〜3営業日以内にご連絡いたします。<br />
          しばらくお待ちください。
        </p>
        <a href="/" className="inline-block bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition">
          トップへ戻る
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">お店を無料で掲載する</h1>
        <p className="text-gray-500">後継者が見つかるまでずっと無料です。お気軽にご登録ください。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">お店の種類</h2>
          <div className="flex gap-4">
            {['美容院', '整骨院'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value={type} checked={form.type === type} onChange={handleChange} className="accent-green-700 w-4 h-4" required />
                <span className="text-lg font-medium">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">店舗情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">店舗名（任意）</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="例：美容室〇〇" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1">公開しない場合は空欄で構いません</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">都道府県 <span className="text-red-500">*</span></label>
                <select name="prefecture" value={form.prefecture} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">選択してください</option>
                  {['大阪府', '兵庫県', '京都府', '奈良県', '滋賀県', 'その他'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">市区町村 <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="例：大阪市北区" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">事業情報</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">譲渡希望金額（万円） <span className="text-red-500">*</span></label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="例：100" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月商（万円）</label>
              <input type="number" name="monthlyRevenue" value={form.monthlyRevenue} onChange={handleChange} placeholder="例：80" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">創業年数</label>
              <input type="number" name="years" value={form.years} onChange={handleChange} placeholder="例：15" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">譲渡理由 <span className="text-red-500">*</span></label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="例：高齢のため、体力的な限界のため" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">譲渡希望時期 <span className="text-red-500">*</span></label>
              <select name="transferTiming" value={form.transferTiming} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">選択してください</option>
                <option value="即時（すぐにでも）">即時（すぐにでも）</option>
                <option value="3ヶ月以内">3ヶ月以内</option>
                <option value="6ヶ月以内">6ヶ月以内</option>
                <option value="1年以内">1年以内</option>
                <option value="1〜2年以内">1〜2年以内</option>
                <option value="時期は相談可能">時期は相談可能</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">お店の説明</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="お店の特徴、強み、引き継いでほしいことなどをご自由にお書きください" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ご連絡先（非公開）</h2>
          <p className="text-sm text-gray-400 mb-4">連絡先は公開されません。TASUKIからのご連絡にのみ使用します。</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
              <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="例：山田 太郎" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="例：yamada@example.com" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="例：090-1234-5678" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? '送信中...' : '無料で掲載を申し込む'}
        </button>
        <p className="text-center text-xs text-gray-400">ご登録いただいた情報は、事業承継マッチング以外の目的には使用しません</p>
      </form>
    </div>
  )
}
