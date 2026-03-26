export type BusinessType = '美容院' | '整骨院'

export interface Listing {
  id: string
  type: BusinessType
  title: string
  prefecture: string
  city: string
  price: number // 万円
  monthlyRevenue: number // 万円/月
  yearsInBusiness: number // 創業年数
  staffCount: number
  reason: string // 譲渡理由
  description: string
  features: string[]
  ownerAge: number
  publishedAt: string
  status: '公開中' | '商談中' | '成約済み'
}

export const listings: Listing[] = [
  {
    id: '1',
    type: '美容院',
    title: '大阪市内 駅徒歩3分の美容院',
    prefecture: '大阪府',
    city: '大阪市北区',
    price: 150,
    monthlyRevenue: 80,
    yearsInBusiness: 22,
    staffCount: 3,
    reason: '体調不良による引退',
    description:
      '地域に根ざした22年の老舗美容院です。常連客が多く安定した売上があります。居抜きでそのまま引き継げるため初期費用を抑えられます。スタッフ2名も引き続き勤務希望とのことで、スムーズな引継ぎが可能です。',
    features: ['駅徒歩3分', '常連客多数', 'スタッフ引継ぎ可', '居抜き物件', '駐車場あり'],
    ownerAge: 68,
    publishedAt: '2026-03-10',
    status: '公開中',
  },
  {
    id: '2',
    type: '美容院',
    title: '神戸市 住宅街の人気美容院',
    prefecture: '兵庫県',
    city: '神戸市灘区',
    price: 80,
    monthlyRevenue: 50,
    yearsInBusiness: 15,
    staffCount: 2,
    reason: '高齢のため後継者を探している',
    description:
      '住宅街に位置する地域密着型の美容院です。口コミで広がった固定客が中心で、広告費をほとんどかけなくても安定した来客があります。オーナーが丁寧に引継ぎサポートします。',
    features: ['固定客多数', '広告費ほぼゼロ', '丁寧な引継ぎサポート', '1階路面店'],
    ownerAge: 72,
    publishedAt: '2026-03-05',
    status: '公開中',
  },
  {
    id: '3',
    type: '整骨院',
    title: '京都市 繁華街近くの整骨院',
    prefecture: '京都府',
    city: '京都市中京区',
    price: 200,
    monthlyRevenue: 120,
    yearsInBusiness: 18,
    staffCount: 4,
    reason: '体力的な限界による引退',
    description:
      '京都市内の好立地に18年営業している整骨院です。交通事故対応・スポーツ障害・高齢者向けリハビリを中心に幅広い患者さんが来院しています。柔道整復師の資格をお持ちの方であれば引継ぎ可能です。',
    features: ['好立地', '交通事故対応あり', '幅広い患者層', '医療機器完備', 'スタッフ引継ぎ可'],
    ownerAge: 65,
    publishedAt: '2026-03-01',
    status: '公開中',
  },
  {
    id: '4',
    type: '整骨院',
    title: '堺市 住宅街の整骨院',
    prefecture: '大阪府',
    city: '堺市堺区',
    price: 100,
    monthlyRevenue: 70,
    yearsInBusiness: 12,
    staffCount: 2,
    reason: '病気療養のため',
    description:
      '住宅街に根ざした整骨院です。高齢者の患者さんが多く、定期的に来院される方がほとんどです。設備一式含めての譲渡を検討しています。院長の体調不良により早めの引継ぎを希望しています。',
    features: ['高齢者患者多数', '設備一式譲渡', '早期引継ぎ希望', '駐車場3台'],
    ownerAge: 60,
    publishedAt: '2026-03-15',
    status: '商談中',
  },
  {
    id: '5',
    type: '美容院',
    title: '奈良市 ショッピングモール内美容院',
    prefecture: '奈良県',
    city: '奈良市',
    price: 120,
    monthlyRevenue: 90,
    yearsInBusiness: 8,
    staffCount: 4,
    reason: '家族の介護のため県外へ転居',
    description:
      'ショッピングモール内に位置するため集客力が高く、8年間安定した売上を維持しています。若い客層が多くトレンドに敏感な美容師さんに向いています。テナント契約の引継ぎについてはモール側との協議が必要です。',
    features: ['モール内高集客', '若い客層', '土日祝日が稼ぎ時', 'スタッフ4名'],
    ownerAge: 45,
    publishedAt: '2026-03-18',
    status: '公開中',
  },
]
