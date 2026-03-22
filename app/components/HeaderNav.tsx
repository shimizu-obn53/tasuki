'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function HeaderNav() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初期取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    // ログイン状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link href="/listings" className="text-gray-600 hover:text-green-800 font-medium">
        案件を探す
      </Link>
      <Link href="/about" className="text-gray-600 hover:text-green-800 font-medium">
        TASUKIとは
      </Link>

      {!loading && (
        user ? (
          <>
            <Link
              href="/mypage"
              className="text-gray-600 hover:text-green-800 font-medium border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
            >
              マイページ
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600 font-medium text-xs"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-600 hover:text-green-800 font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 font-medium transition"
            >
              無料で掲載する
            </Link>
          </>
        )
      )}
    </nav>
  )
}
