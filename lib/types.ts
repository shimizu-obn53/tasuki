export type Site = 'lancers' | 'visasq' | 'coconala' | 'crowdworks' | 'other'
export type Status = '未応募' | '応募中' | '選考中' | '受注' | '完了' | '見送り'

export interface FreelanceJob {
  id: string
  site: Site
  title: string
  url: string | null
  amount: number | null
  status: Status
  applied_at: string | null
  completed_at: string | null
  notes: string | null
  created_at: string
}

export interface FreelanceApplication {
  id: string
  job_id: string
  content: string
  created_at: string
}

export const SITE_LABELS: Record<Site, string> = {
  lancers: 'ランサーズ',
  visasq: 'VisasQ',
  coconala: 'ココナラ',
  crowdworks: 'CrowdWorks',
  other: 'その他',
}

export const STATUS_COLORS: Record<Status, string> = {
  '未応募': 'bg-gray-100 text-gray-600',
  '応募中': 'bg-blue-100 text-blue-700',
  '選考中': 'bg-yellow-100 text-yellow-700',
  '受注': 'bg-purple-100 text-purple-700',
  '完了': 'bg-green-100 text-green-700',
  '見送り': 'bg-red-100 text-red-600',
}

export const SITE_COLORS: Record<Site, string> = {
  lancers: 'bg-orange-100 text-orange-700',
  visasq: 'bg-cyan-100 text-cyan-700',
  coconala: 'bg-pink-100 text-pink-700',
  crowdworks: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-600',
}
