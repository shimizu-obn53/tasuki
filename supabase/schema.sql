-- ================================================
-- TASUKI データベーススキーマ
-- Supabaseのダッシュボード > SQL Editor に貼り付けて実行
-- ================================================

-- 案件テーブル
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('美容院', '整骨院')),
  title TEXT,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  price INTEGER NOT NULL,
  monthly_revenue INTEGER,
  years_in_business INTEGER,
  staff_count INTEGER,
  reason TEXT NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  owner_age INTEGER,
  status TEXT NOT NULL DEFAULT '審査中' CHECK (status IN ('審査中', '公開中', '商談中', '成約済み')),
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 問い合わせテーブル
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- RLS（行レベルセキュリティ）設定
-- ================================================

-- listings: 公開中の案件は誰でも読める
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公開中の案件は誰でも閲覧可能" ON listings
  FOR SELECT USING (status IN ('公開中', '商談中', '成約済み'));

CREATE POLICY "誰でも掲載申込できる" ON listings
  FOR INSERT WITH CHECK (true);

-- inquiries: 誰でも問い合わせできる
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でも問い合わせできる" ON inquiries
  FOR INSERT WITH CHECK (true);

-- ================================================
-- サンプルデータ（テスト用）
-- ================================================

INSERT INTO listings (type, title, prefecture, city, price, monthly_revenue, years_in_business, staff_count, reason, description, features, owner_age, status, owner_name, email, published_at) VALUES
('美容院', '大阪市内 駅徒歩3分の美容院', '大阪府', '大阪市北区', 150, 80, 22, 3, '体調不良による引退', '地域に根ざした22年の老舗美容院です。常連客が多く安定した売上があります。', ARRAY['駅徒歩3分', '常連客多数', 'スタッフ引継ぎ可', '居抜き物件'], 68, '公開中', '山田太郎', 'sample1@example.com', NOW()),
('美容院', '神戸市 住宅街の人気美容院', '兵庫県', '神戸市灘区', 80, 50, 15, 2, '高齢のため後継者を探している', '住宅街に位置する地域密着型の美容院です。', ARRAY['固定客多数', '広告費ほぼゼロ', '丁寧な引継ぎサポート'], 72, '公開中', '田中花子', 'sample2@example.com', NOW()),
('整骨院', '京都市 繁華街近くの整骨院', '京都府', '京都市中京区', 200, 120, 18, 4, '体力的な限界による引退', '京都市内の好立地に18年営業している整骨院です。', ARRAY['好立地', '交通事故対応あり', '幅広い患者層'], 65, '公開中', '鈴木一郎', 'sample3@example.com', NOW());
