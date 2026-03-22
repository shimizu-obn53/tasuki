'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  listingId: string
  images: string[]
  onUpdate: (newImages: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ listingId, images, onUpdate, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remaining = maxImages - images.length
    if (remaining <= 0) {
      setError(`最大${maxImages}枚まで登録できます`)
      return
    }

    setUploading(true)
    setError('')

    const newImages = [...images]

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i]

      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setError('1ファイル5MB以下にしてください')
        continue
      }

      // 拡張子チェック
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext ?? '')) {
        setError('jpg・png・webp形式のみ対応しています')
        continue
      }

      const fileName = `${listingId}/${Date.now()}_${i}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) {
        setError('アップロードに失敗しました')
        continue
      }

      const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName)
      newImages.push(data.publicUrl)
    }

    // DBを更新
    await supabase.from('listings').update({ images: newImages }).eq('id', listingId)
    onUpdate(newImages)
    setUploading(false)

    // inputをリセット
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (url: string) => {
    if (!confirm('この写真を削除しますか？')) return

    // Storage上のパスを抽出
    const path = url.split('/listing-images/')[1]
    if (path) {
      await supabase.storage.from('listing-images').remove([path])
    }

    const newImages = images.filter(img => img !== url)
    await supabase.from('listings').update({ images: newImages }).eq('id', listingId)
    onUpdate(newImages)
  }

  return (
    <div>
      {/* 現在の写真一覧 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((url, idx) => (
            <div key={url} className="relative group aspect-square">
              <img
                src={url}
                alt={`写真${idx + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                ×
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-green-700 text-white text-xs px-2 py-0.5 rounded font-medium">
                  メイン
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* アップロードボタン */}
      {images.length < maxImages && (
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition
          ${uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-green-300 hover:bg-green-50'}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <span className="text-green-700 text-xl">{uploading ? '⏳' : '📷'}</span>
          <span className="text-sm font-medium text-gray-600">
            {uploading ? 'アップロード中...' : `写真を追加（${images.length}/${maxImages}枚）`}
          </span>
        </label>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">1枚目がメイン写真になります。jpg・png・webp / 各5MB以下</p>
    </div>
  )
}
