import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BusinessType = '美容院' | '整骨院'

export interface Listing {
  id: string
  type: BusinessType
  title: string
  prefecture: string
  city: string
  price: number
  monthly_revenue: number
  years_in_business: number
  staff_count: number
  reason: string
  description: string
  features: string[]
  owner_age: number
  published_at: string
  status: '公開中' | '商談中' | '成約済み'
  owner_name: string
  email: string
  phone: string
}

export interface Inquiry {
  id: string
  listing_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  message: string
  created_at: string
}
