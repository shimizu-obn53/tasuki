'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function InquiryForm({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('inquiries').insert({
      listing_id: listingId,
      buyer_name: form.buyer_name,
      buyer_email: form.buyer_email,
      buyer_phone: form.buyer_phone || null,
      message: form.message,
      status: '未読',
    })

    setLoading(false)

    if (error) {
      setError('送信に失敗しました。もう一度お試しください。')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-green-800 text-white rounded-2xl p-6 shadow-lg text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-lg mb-1">送信しました</p>
        <p className="text-green-200 text-sm">売り手オーナーへ通知されます。返答をお待ちください。</p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="bg-green-800 text-white rounded-2xl p-6 shadow-lg mb-4">
        <p className="text-green-200 text-sm mb-1">譲渡希望金額</p>
        <p className="text-4xl font-bold mb-4" id="listing-price-display"></p>
        <button
          onClick={() => setOpen(true)}
          className="block w-full bg-yellow-400 text-green-900 text-center py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
        >
          この案件に問い合わせる
        </button>
        <p className="text-green-300 text-xs text-center mt-3">※ 問い合わせは無料です</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">問い合わせフォーム</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕ 閉じる</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">お名前 <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="buyer_name"
            value={form.buyer_name}
            onChange={handleChange}
            placeholder="山田 花子"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">メールアドレス <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="buyer_email"
            value={form.buyer_email}
            onChange={handleChange}
            placeholder="hanako@example.com"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">電話番号（任意）</label>
          <input
            type="tel"
            name="buyer_phone"
            value={form.buyer_phone}
            onChange={handleChange}
            placeholder="090-1234-5678"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">メッセージ <span className="text-red-500">*</span></label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="この案件に興味があります。詳しいお話を聞かせていただけますか？"
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-600 text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition text-sm disabled:opacity-50"
        >
          {loading ? '送信中...' : '送信する（無料）'}
        </button>
        <p className="text-xs text-gray-400 text-center">送信後、売り手オーナーに通知されます</p>
      </form>
    </div>
  )
}
