import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">TASUKIとは</h1>
        <p className="text-gray-500 text-lg">
          美容院・整骨院の事業承継を専門にサポートするマッチングサービスです
        </p>
      </div>

      {/* ミッション */}
      <div className="bg-green-800 text-white rounded-3xl p-10 mb-12 text-center">
        <h2 className="text-2xl font-bold mb-4">私たちのミッション</h2>
        <p className="text-green-100 text-lg leading-relaxed">
          長年かけて育ててきた技術・顧客・想いを、<br />
          次の世代へ確実につなぐ。<br />
          廃業ではなく、継承という選択肢を。
        </p>
      </div>

      {/* 背景 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">なぜTASUKIを作ったか</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          日本では毎年6万件以上の中小企業・個人事業が「後継者がいない」という理由だけで廃業しています。その多くは黒字経営であり、地域に根ざした大切なお店です。
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          既存の事業承継サービスは数百万円以上の大規模な案件を対象にしており、美容院や整骨院のような小規模な事業承継は対応されていませんでした。
        </p>
        <p className="text-gray-600 leading-relaxed">
          TASUKIは、そういった小規模でも大切なお店の継承を支援するために生まれました。
        </p>
      </div>

      {/* 利用の流れ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">ご利用の流れ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* 売り手 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-green-800 mb-6 pb-3 border-b border-green-100">
              お店を売りたい方
            </h3>
            <div className="space-y-5">
              {[
                { step: '1', title: '無料で掲載申し込み', desc: 'フォームに必要事項を入力するだけ。5分で完了します。' },
                { step: '2', title: '内容確認・掲載開始', desc: 'TASUKIが内容を確認後、2〜3営業日で掲載開始します。' },
                { step: '3', title: '買い手からの問い合わせ', desc: '興味を持った方からメッセージが届きます。' },
                { step: '4', title: '面談・交渉・成約', desc: 'TASUKIがサポートしながら成約まで進めます。' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 買い手 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-blue-800 mb-6 pb-3 border-b border-blue-100">
              お店を引き継ぎたい方
            </h3>
            <div className="space-y-5">
              {[
                { step: '1', title: '案件を検索', desc: '業種・地域で絞り込んで気になる案件を探します。' },
                { step: '2', title: '詳細を確認', desc: '譲渡金額・月商・創業年数など詳細情報を確認します。' },
                { step: '3', title: '無料で問い合わせ', desc: '興味のある案件にメッセージを送ります。費用は一切かかりません。' },
                { step: '4', title: '面談・交渉・成約', desc: 'TASUKIがサポートしながら成約まで進めます。' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 料金 */}
      <div className="bg-green-50 rounded-2xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">料金について</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">掲載費用</p>
            <p className="text-3xl font-bold text-green-700">無料</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">閲覧・問い合わせ</p>
            <p className="text-3xl font-bold text-green-700">無料</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">成約時手数料</p>
            <p className="text-3xl font-bold text-gray-700">別途</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">※ 成約時の手数料は成約金額に応じてご相談させていただきます</p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/register"
          className="inline-block bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition mr-4"
        >
          無料で掲載する
        </Link>
        <Link
          href="/listings"
          className="inline-block border-2 border-green-700 text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition"
        >
          案件を見る
        </Link>
      </div>
    </div>
  )
}
