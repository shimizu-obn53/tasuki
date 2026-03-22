'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Listing, Inquiry } from '@/lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  '審査中': 'bg-yellow-100 text-yellow-800',
  '公開中': 'bg-green-100 text-green-800',
  '商談中': 'bg-blue-100 text-blue-800',
  '成約済み': 'bg-gray-100 text-gray-600',
  '取り下げ': 'bg-red-100 text-red-600',
}

const INQUIRY_STATUS_COLORS: Record<string, string> = {
  '未読': 'bg-red-100 text-red-700',
  '既読': 'bg-yellow-100 text-yellow-700',
  '対応済み': 'bg-gray-100 text-gray-500',
}

export default function MyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Listing>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 自分の掲載情報を取得
      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (listingData) {
        setListing(listingData)
        setEditForm(listingData)

        // 問い合わせ一覧を取得
        const { data: inquiryData } = await supabase
          .from('inquiries')
          .select('*')
          .eq('listing_id', listingData.id)
          .order('created_at', { ascending: false })

        setInquiries(inquiryData ?? [])
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!listing) return
    setSaving(true)
    setSaveMsg('')

    const { error } = await supabase
      .from('listings')
      .update({
        price: editForm.price ? Number(editForm.price) : listing.price,
        reason: editForm.reason,
        transfer_timing: editForm.transfer_timing,
        description: editForm.description,
        phone: editForm.phone,
      })
      .eq('id', listing.id)

    setSaving(false)
    if (error) {
      setSaveMsg('保存に失敗しました。')
    } else {
      setSaveMsg('保存しました ✓')
      setListing({ ...listing, ...editForm } as Listing)
      setEditing(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  const handleWithdraw = async () => {
    if (!listing) return
    if (!confirm('掲載を取り下げますか？取り下げ後は買い手から見えなくなります。')) return

    const { error } = await supabase
      .from('listings')
      .update({ status: '取り下げ' })
      .eq('id', listing.id)

    if (!error) {
      setListing({ ...listing, status: '取り下げ' })
    }
  }

  const markInquiryRead = async (inquiryId: string) => {
    await supabase.from('inquiries').update({ status: '既読' }).eq('id', inquiryId)
    setInquiries(inquiries.map(i => i.id === inquiryId ? { ...i, status: '既読' } : i))
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400 text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-3">掲載情報がありません</h1>
        <p className="text-gray-500 mb-8">まだ掲載登録が完了していない可能性があります。</p>
        <a href="/register" className="inline-block bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition">
          掲載を申し込む
        </a>
      </div>
    )
  }

  const unreadCount = inquiries.filter(i => i.status === '未読').length

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">マイページ</h1>
          <p className="text-gray-500 text-sm mt-1">{listing.owner_name} さん</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-lg transition"
        >
          ログアウト
        </button>
      </div>

      {/* 掲載ステータス */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">掲載情報</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[listing.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {listing.status}
          </span>
        </div>

        {!editing ? (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <div>
                <p className="text-gray-400 mb-1">種別</p>
                <p className="font-medium text-gray-800">{listing.type}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">エリア</p>
                <p className="font-medium text-gray-800">{listing.prefecture} {listing.city}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">譲渡希望金額</p>
                <p className="font-bold text-green-700 text-lg">{listing.price.toLocaleString()}万円</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">譲渡希望時期</p>
                <p className="font-medium text-gray-800">{listing.transfer_timing ?? '相談可能'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">譲渡理由</p>
                <p className="text-gray-800">{listing.reason}</p>
              </div>
              {listing.description && (
                <div className="col-span-2">
                  <p className="text-gray-400 mb-1">お店の説明</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 border border-green-700 text-green-700 py-2 rounded-lg font-medium hover:bg-green-50 transition text-sm"
              >
                内容を編集
              </button>
              {listing.status !== '取り下げ' && listing.status !== '成約済み' && (
                <button
                  onClick={handleWithdraw}
                  className="border border-red-300 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                >
                  取り下げ
                </button>
              )}
            </div>
          </>
        ) : (
          /* 編集フォーム */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">譲渡希望金額（万円）</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price ?? ''}
                  onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">譲渡希望時期</label>
                <select
                  name="transfer_timing"
                  value={editForm.transfer_timing ?? ''}
                  onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">選択してください</option>
                  {['即時（すぐにでも）','3ヶ月以内','6ヶ月以内','1年以内','1〜2年以内','時期は相談可能'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">譲渡理由</label>
              <input
                type="text"
                name="reason"
                value={editForm.reason ?? ''}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">お店の説明</label>
              <textarea
                name="description"
                value={editForm.description ?? ''}
                onChange={handleEditChange}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">電話番号</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone ?? ''}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {saveMsg && (
              <p className="text-green-600 text-sm font-medium">{saveMsg}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition text-sm disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存する'}
              </button>
              <button
                onClick={() => { setEditing(false); setEditForm(listing) }}
                className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 問い合わせ一覧 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-gray-800">問い合わせ</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              未読 {unreadCount}件
            </span>
          )}
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">まだ問い合わせはありません</p>
            <p className="text-gray-400 text-sm mt-1">案件が公開されると買い手から届きます</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`border rounded-xl p-4 transition ${inquiry.status === '未読' ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{inquiry.buyer_name}</p>
                    <p className="text-xs text-gray-400">{inquiry.buyer_email}{inquiry.buyer_phone ? `　${inquiry.buyer_phone}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${INQUIRY_STATUS_COLORS[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(inquiry.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{inquiry.message}</p>
                {inquiry.status === '未読' && (
                  <button
                    onClick={() => markInquiryRead(inquiry.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    既読にする
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
