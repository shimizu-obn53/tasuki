'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    setLoading(false)

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません。')
      return
    }

    router.push('/mypage')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ログイン</h1>
          <p className="text-gray-500">売り手マイページへのログイン</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="登録時のメールアドレス"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="パスワード"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            まだ登録していない方は
            <Link href="/register" className="text-green-700 font-medium hover:underline ml-1">
              無料で掲載登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
