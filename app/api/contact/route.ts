import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { listing_id, listing_title, buyer_name, buyer_email, buyer_phone, message } = body

  // Supabaseに問い合わせを保存
  const { error: dbError } = await supabase.from('inquiries').insert({
    listing_id,
    buyer_name,
    buyer_email,
    buyer_phone,
    message,
  })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // 売り手のメールアドレスを取得
  const { data: listing } = await supabase
    .from('listings')
    .select('email, owner_name')
    .eq('id', listing_id)
    .single()

  // メール通知送信（Resend）
  if (listing?.email && process.env.RESEND_API_KEY) {
    // 管理者への通知
    await resend.emails.send({
      from: 'TASUKI <noreply@tasuki-match.jp>',
      to: process.env.ADMIN_EMAIL ?? 'admin@tasuki-match.jp',
      subject: `【TASUKI】新しいお問い合わせ: ${listing_title}`,
      html: `
        <h2>新しいお問い合わせが届きました</h2>
        <p><strong>案件:</strong> ${listing_title}</p>
        <hr>
        <p><strong>お名前:</strong> ${buyer_name}</p>
        <p><strong>メール:</strong> ${buyer_email}</p>
        <p><strong>電話:</strong> ${buyer_phone ?? '未入力'}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // 問い合わせ者への自動返信
    await resend.emails.send({
      from: 'TASUKI <noreply@tasuki-match.jp>',
      to: buyer_email,
      subject: '【TASUKI】お問い合わせを受け付けました',
      html: `
        <h2>${buyer_name} 様</h2>
        <p>TASUKIへのお問い合わせありがとうございます。</p>
        <p>以下の内容でお問い合わせを受け付けました。</p>
        <hr>
        <p><strong>案件:</strong> ${listing_title}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>TASUKIが確認後、2〜3営業日以内にご連絡いたします。</p>
        <p>TASUKI運営事務局</p>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
