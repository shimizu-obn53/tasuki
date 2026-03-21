'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Listing } from '@/lib/supabase'

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'すべて' | '美容院' | '整骨院'>('すべて')
  const [selectedPref, setSelectedPref] = useState('すべて')

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .in('status', ['公開中', '商談中'])
        .order('published_at', { ascending: false })

      if (!error && data) setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  const prefectures = ['すべて', ...Array.from(new Set(listings.map(l => l.prefecture)))]

  const filtered = listings.filter(l => {
    const typeMatch = selectedType === 'すべて' || l.type === selectedType
    const prefMatch = selectedPref === 'すべて' || l.prefecture === selectedPref
    return typeMatch && prefMatch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">案件一覧</h1>
        <p className="text-gray-500">現在 <span className="font-bold text-green-700">{filtered.length}件</span> の案件が公開されています</p>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">業種</p>
            <div className="flex gap-2">
              {(['すべて', '美容院', '整骨院'] as const).map(type => (
                <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedType === type ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">都道府県</p>
            <select value={selectedPref} onChange={e => setSelectedPref(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              {prefectures.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ローディング */}
      {loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">読み込み中...</p>
        </div>
      )}

      {/* 案件リスト */}
      {!loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(listing => (
            <Link href={`/listings/${listing.id}`} key={listing.id}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${listing.type === '美容院' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {listing.type}
                    </span>
                    <span className="text-xs text-gray-400">{listing.city}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${listing.status === '公開中' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {listing.status}
                  </span>
                </div>
                <h2 className="font-bold text-gray-800 text-lg mb-3 leading-snug">{listing.title}</h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">譲渡金額</p>
                    <p className="font-bold text-green-700">{listing.price}万円</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">月商</p>
                    <p className="font-bold text-gray-700">{listing.monthly_revenue ?? '-'}万円</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">創業</p>
                    <p className="font-bold text-gray-700">{listing.years_in_business ?? '-'}年</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{listing.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(listing.features ?? []).slice(0, 3).map((f: string) => (
                    <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">該当する案件がありません</p>
          <p className="text-sm">条件を変えて検索してみてください</p>
        </div>
      )}
    </div>
  )
}
