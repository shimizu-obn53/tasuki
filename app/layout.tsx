import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import HeaderNav from './components/HeaderNav'

export const metadata: Metadata = {
  title: 'TASUKI - 美容院・整骨院の事業承継マッチング',
  description: '美容院・整骨院の事業承継を専門にサポートするマッチングサービス。売りたいオーナーと継ぎたい方をつなぎます。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-800 tracking-wide">
              TASUKI
              <span className="text-sm font-normal text-gray-500 ml-2">たすき</span>
            </Link>
            <HeaderNav />
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="min-h-screen">{children}</main>

        {/* フッター */}
        <footer className="bg-green-900 text-white mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-xl font-bold mb-2">TASUKI</p>
                <p className="text-green-200 text-sm">
                  美容院・整骨院の事業承継を<br />専門にサポートします
                </p>
              </div>
              <div>
                <p className="font-semibold mb-3 text-green-200">サービス</p>
                <ul className="space-y-2 text-sm text-green-300">
                  <li><Link href="/listings" className="hover:text-white">案件を探す</Link></li>
                  <li><Link href="/register" className="hover:text-white">無料で掲載する</Link></li>
                  <li><Link href="/about" className="hover:text-white">TASUKIとは</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-3 text-green-200">お問い合わせ</p>
                <p className="text-sm text-green-300">info@tasuki-match.jp</p>
              </div>
            </div>
            <div className="border-t border-green-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-green-400 text-xs">
              <span>© 2026 TASUKI. All rights reserved.</span>
              <Link href="/terms" className="hover:text-white underline">利用規約</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
