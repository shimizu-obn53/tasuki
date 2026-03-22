'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Listing, Inquiry } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''

const STATUS_COLORS: Record<string, string> = {
  '審査中': 'bg-yellow-100 text-yellow-800',
  '公開中': 'bg-green-100 text-green-800',
  '商談中': 'bg-blue-100 text-blue-800',
  '成約済み': 'bg-gray-200 text-gray-600',
  '取り下げ': 'bg-red-100 text-red-600',
}

const CHECKLISTS = [
  { label: '面談前チェックリスト【売り手用】', file: 'checklist_seller_meeting.pdf' },
  { label: '面談前チェックリスト【買い手用】', file: 'checklist_buyer_meeting.pdf' },
  { label: '引き継ぎ確認チェックリスト', file: 'checklist_handover.pdf' },
]

const TEMPLATES = [
  { label: '基本合意書（LOI）ひな形', file: 'template_loi.pdf' },
  { label: '事業譲渡契約書ひな形', file: 'template_transfer.pdf' },
]

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('すべて')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/admin/login')
        return
      }

      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .order('published_at', { ascending: false })
      setListings(listingData ?? [])

      const { data: inquiryData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      setInquiries(inquiryData ?? [])

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    await supabase.from('listings').update({ status: newStatus }).eq('id', listingId)
    setListings(listings.map(l => l.id === listingId ? { ...l, status: newStatus as Listing['status'] } : l))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">読み込み中...</div>
  }

  const filtered = statusFilter === 'すべて' ? listings : listings.filter(l => l.status === statusFilter)
  const unreadCount = inquiries.filter(i => i.status === '未読').length
  const statusCounts = ['審査中', '公開中', '商談中', '成約済み', '取り下げ'].map(s => ({
    label: s,
    count: listings.filter(l => l.status === s).length
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">管理画面</h1>
          <p className="text-gray-400 text-sm">TASUKI Admin Dashboard</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-lg">
          ログアウト
        </button>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statusCounts.map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(label)}
            className={`bg-white rounded-xl p-4 shadow-sm border text-center transition hover:border-green-400 ${statusFilter === label ? 'border-green-500 ring-1 ring-green-400' : 'border-gray-100'}`}
          >
            <p className="text-2xl font-bold text-gray-800">{count}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* 未読問い合わせ */}
      {unreadCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
          <span className="text-red-600 font-bold text-sm">🔔 未読の問い合わせが {unreadCount} 件あります</span>
        </div>
      )}

      {/* チェックリスト・契約書DL */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">📋 チェックリスト</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {CHECKLISTS.map(({ label, file }) => (
              <a
                key={file}
                href={`/downloads/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-green-200 rounded-xl px-4 py-3 hover:bg-green-50 transition"
              >
                <span className="text-green-700 text-xl">📄</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">📝 契約書ひな形</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {TEMPLATES.map(({ label, file }) => (
              <a
                key={file}
                href={`/downloads/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-50 transition"
              >
                <span className="text-blue-700 text-xl">📝</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 掲載一覧 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">
            掲載一覧
            {statusFilter !== 'すべて' && <span className="ml-2 text-sm text-gray-400">（{statusFilter}）</span>}
          </h2>
          <button
            onClick={() => setStatusFilter('すべて')}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            すべて表示
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">該当する掲載がありません</div>
          ) : (
            filtered.map(listing => {
              const listingInquiries = inquiries.filter(i => i.listing_id === listing.id)
              const unread = listingInquiries.filter(i => i.status === '未読').length
              return (
                <div key={listing.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[listing.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {listing.status}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{listing.type}</span>
                        {unread > 0 && (
                          <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                            未読 {unread}件
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 truncate">{listing.title}</p>
                      <p className="text-sm text-gray-500">{listing.prefecture} {listing.city}　{listing.price.toLocaleString()}万円</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {listing.owner_name}　{listing.email}　{listing.phone}
                      </p>
                      <p className="text-xs text-gray-400">
                        問い合わせ {listingInquiries.length}件
                        {listing.transfer_timing && `　譲渡希望：${listing.transfer_timing}`}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {/* ステータス変更 */}
                      <select
                        value={listing.status}
                        onChange={e => handleStatusChange(listing.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        {['審査中', '公開中', '商談中', '成約済み', '取り下げ'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {/* 編集ボタン */}
                      <Link
                        href={`/admin/listings/edit?id=${listing.id}`}
                        className="text-center border border-blue-200 text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        編集
                      </Link>
                    </div>
                  </div>

                  {/* 問い合わせ一覧（展開） */}
                  {listingInquiries.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {listingInquiries.map(inq => (
                        <div key={inq.id} className={`rounded-lg px-4 py-2 text-xs ${inq.status === '未読' ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-gray-700">{inq.buyer_name}　{inq.buyer_email}　{inq.buyer_phone ?? ''}</span>
                            <span className="text-gray-400">{new Date(inq.created_at).toLocaleDateString('ja-JP')}</span>
                          </div>
                          <p className="text-gray-600">{inq.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
