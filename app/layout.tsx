import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import HeaderNav from '@/app/components/HeaderNav'

export const metadata: Metadata = {
  title: 'TASUKI - 美容院・整骨院の事業承継マッチング',
  description: '美容院・整骨院専門の事業承継マッチングプラットフォーム。後継者不在でお困りのオーナー様と、独立・開業を目指す方をつなぎます。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 min-h-screen">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-green-800 tracking-tight">
              TASUKI <span className="text-sm font-normal text-gray-400">たすき</span>
            </Link>
            <HeaderNav />
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-green-900 text-white mt-20 py-12 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-lg mb-2">TASUKI</p>
              <p className="text-green-300 text-sm">美容院・整骨院の事業承継を<br />専門にサポートします</p>
            </div>
            <div>
              <p className="font-bold mb-3">サービス</p>
              <ul className="space-y-2 text-green-300 text-sm">
                <li><Link href="/listings" className="hover:text-white transition">案件を探す</Link></li>
                <li><Link href="/register" className="hover:text-white transition">無料で掲載する</Link></li>
                <li><Link href="/about" className="hover:text-white transition">TASUKIとは</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-3">お問い合わせ</p>
              <p className="text-green-300 text-sm">info@tasuki-match.jp</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-green-800 flex justify-between items-center text-green-400 text-xs">
            <p>© 2026 TASUKI. All rights reserved.</p>
            <Link href="/terms" className="hover:text-white transition">利用規約</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
