import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '案件管理',
  description: '副業・フリーランス案件の管理ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 min-h-screen">
        <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-wide">
              📋 案件管理
            </Link>
            <nav className="flex gap-5 text-sm font-medium">
              <Link href="/" className="hover:text-slate-300 transition-colors">ダッシュボード</Link>
              <Link href="/jobs" className="hover:text-slate-300 transition-colors">案件一覧</Link>
              <Link href="/income" className="hover:text-slate-300 transition-colors">収入</Link>
              <Link href="/jobs/new" className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-full transition-colors">
                ＋ 新規追加
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
