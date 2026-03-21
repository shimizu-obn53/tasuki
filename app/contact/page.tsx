'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ContactForm() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('id') ?? ''
  const listingTitle = searchParams.get('title') ?? '案件'

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        listing_title: listingTitle,
        buyer_name: form.buyerName,
        buyer_email: form.buyerEmail,
        buyer_phone: form.buyerPhone,
        message: form.message,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('送信に失敗しました。もう一度お試しください。')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">お問い合わせを受け付けました</h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          TASUKIより確認後、ご連絡いたします。<br />
          しばらくお待ちください。
        </p>
        <Link href="/listings" className="inline-block bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition">
          案件一覧へ戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">
          <Link href="/listings" className="hover:text-green-700">案件一覧</Link>
          <span className="mx-2">/</span>
          {decodeURIComponent(listingTitle)}
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">この案件に問い合わせる</h1>
        <p className="text-gray-500">問い合わせは無料です。TASUKIが仲介してご連絡します。</p>
      </div>

      <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
        <p className="text-sm text-green-800 font-medium">📌 お問い合わせ案件</p>
        <p className="text-green-700 mt-1">{decodeURIComponent(listingTitle)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
            <input type="text" name="buyerName" value={form.buyerName} onChange={handleChange} placeholder="例：山田 太郎" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
              <input type="email" name="buyerEmail" value={form.buyerEmail} onChange={handleChange} placeholder="例：yamada@example.com" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
              <input type="tel" name="buyerPhone" value={form.buyerPhone} onChange={handleChange} placeholder="例：090-1234-5678" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メッセージ <span className="text-red-500">*</span></label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} required placeholder="この案件への興味・経歴・開業予定時期など、自由にお書きください" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg disabled:opacity-50">
          {loading ? '送信中...' : '問い合わせを送る（無料）'}
        </button>
      </form>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">読み込み中...</div>}>
      <ContactForm />
    </Suspense>
  )
}
