'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Listing } from '@/lib/supabase'

export default function Home() {
  const [recentListings, setRecentListings] = useState<Listing[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', '公開中')
        .order('published_at', { ascending: false })
        .limit(3)

      if (!error && data) setRecentListings(data)
    }
    fetchListings()
  }, [])

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-200 text-lg mb-4 font-medium">美容院・整骨院専門</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            大切なお店を、<br />次の人へ。
          </h1>
          <p className="text-green-100 text-xl mb-10 leading-relaxed">
            長年育ててきたお店を閉めるのではなく、<br />
            志ある後継者へバトンを渡しませんか。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-white text-green-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-lg"
            >
              案件を見る（無料）
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-800 transition"
            >
              お店を載せる（無料）
            </Link>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="bg-white py-12 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-700">25万</p>
            <p className="text-gray-500 mt-1 text-sm">美容院・理容室の店舗数</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-700">約半数</p>
            <p className="text-gray-500 mt-1 text-sm">後継者不在の事業主割合</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-700">無料</p>
            <p className="text-gray-500 mt-1 text-sm">掲載・閲覧費用</p>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">TASUKIの特徴</h2>
          <p className="text-center text-gray-500 mb-12">美容院・整骨院に特化しているから、マッチングが早い</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-green-800">専門特化</h3>
              <p className="text-gray-600 leading-relaxed">
                美容院・整骨院だけに絞っているため、同じ業種の買い手が集まりやすく、成約までが早いです。
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-green-800">小規模案件に対応</h3>
              <p className="text-gray-600 leading-relaxed">
                50万円〜の小規模な譲渡にも対応。大手M&Aサービスでは断られがちな案件もお任せください。
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-green-800">安心のサポート</h3>
              <p className="text-gray-600 leading-relaxed">
                掲載から成約まで丁寧にサポート。はじめての方でも安心してご利用いただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 最新案件セクション */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">最新の案件</h2>
          <p className="text-center text-gray-500 mb-10">現在公開中の事業承継案件</p>
          <div className="grid md:grid-cols-3 gap-6">
            {recentListings.map((listing) => (
              <Link href={`/listings/${listing.id}`} key={listing.id}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      listing.type === '美容院'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {listing.type}
                    </span>
                    <span className="text-xs text-gray-400">{listing.prefecture}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 leading-snug">{listing.title}</h3>
                  <p className="text-2xl font-bold text-green-700 mb-1">
                    {listing.price}万円
                  </p>
                  <p className="text-sm text-gray-500">月商 {listing.monthly_revenue}万円 / 創業{listing.years_in_business}年</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/listings"
              className="inline-block bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition"
            >
              すべての案件を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 売り手向けCTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-green-800 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">お店の掲載は無料です</h2>
          <p className="text-green-200 text-lg mb-8 leading-relaxed">
            後継者が見つかるまでずっと無料で掲載できます。<br />
            まずはお気軽にご登録ください。
          </p>
          <Link
            href="/register"
            className="inline-block bg-yellow-400 text-green-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
          >
            無料で掲載する
          </Link>
        </div>
      </section>
    </div>
  )
}
