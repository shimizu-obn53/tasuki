import { supabase, Listing } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single<Listing>()

  if (!listing) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-700">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/listings" className="hover:text-green-700">案件一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{listing.title}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${listing.type === '美容院' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
              {listing.type}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${listing.status === '公開中' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {listing.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
          <p className="text-gray-400 text-sm mb-8">{listing.prefecture} {listing.city}</p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">基本情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">譲渡希望金額</p>
                <p className="text-2xl font-bold text-green-700">{listing.price}万円</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">月商</p>
                <p className="text-2xl font-bold text-gray-700">{listing.monthly_revenue ?? '-'}万円</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">創業年数</p>
                <p className="text-xl font-bold text-gray-700">{listing.years_in_business ?? '-'}年</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">スタッフ数</p>
                <p className="text-xl font-bold text-gray-700">{listing.staff_count ?? '-'}名</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 col-span-2">
                <p className="text-xs text-gray-400 mb-1">譲渡希望時期</p>
                <p className="text-xl font-bold text-green-700">{listing.transfer_timing ?? '相談可能'}</p>
              </div>
            </div>
          </div>

          {listing.description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">事業の説明</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {listing.features && listing.features.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">この案件の特徴</h2>
              <div className="flex flex-wrap gap-3">
                {listing.features.map((f: string) => (
                  <span key={f} className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">✓ {f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">譲渡理由</h2>
            <p className="text-gray-600">{listing.reason}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="bg-green-800 text-white rounded-2xl p-6 shadow-lg mb-4">
              <p className="text-green-200 text-sm mb-1">譲渡希望金額</p>
              <p className="text-4xl font-bold mb-4">{listing.price}<span className="text-xl">万円</span></p>
              <Link
                href={`/contact?id=${listing.id}&title=${encodeURIComponent(listing.title ?? '')}`}
                className="block bg-yellow-400 text-green-900 text-center py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
              >
                この案件に問い合わせる
              </Link>
              <p className="text-green-300 text-xs text-center mt-3">※ 問い合わせは無料です</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-sm text-gray-600">
              <p className="font-bold text-gray-800 mb-3">ご注意事項</p>
              <ul className="space-y-2 text-xs leading-relaxed">
                <li>・ 掲載情報は売り手の申告に基づいています</li>
                <li>・ 成約時には別途手数料が発生します</li>
                <li>・ 資格が必要な業種は免許の確認が必要です</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
