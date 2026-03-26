import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BusinessType = '美容院' | '整骨院'
export type ListingStatus = '審査中' | '公開中' | '商談中' | '成約済み' | '取り下げ'

export interface Listing {
  id: string
  type: BusinessType
  title: string
  prefecture: string
  city: string
  price: number
  monthly_revenue: number | null
  years_in_business: number | null
  staff_count: number | null
  reason: string | null
  transfer_timing: string | null
  description: string | null
  features: string[] | null
  images: string[] | null
  owner_name: string | null
  owner_age: number | null
  email: string | null
  phone: string | null
  status: ListingStatus
  published_at: string | null
  created_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string | null
  message: string
  status: '未読' | '対応済み'
  created_at: string
}
