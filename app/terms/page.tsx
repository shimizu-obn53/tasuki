export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">利用規約</h1>
      <p className="text-sm text-gray-400 mb-12">制定日：2026年3月21日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">

        {/* 第1条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第1条（目的・定義）
          </h2>
          <p className="mb-3">
            本規約は、TASUKIの運営者（以下「運営者」）が提供する事業承継マッチングサービス「TASUKI」（以下「本サービス」）の利用条件を定めるものです。
          </p>
          <p className="mb-3">本規約において使用する用語の定義は以下のとおりとします。</p>
          <ol className="space-y-2 pl-5">
            <li>①　「本サービス」とは、運営者が https://tasuki-match.vercel.app において提供する、美容院・整体院等の小規模事業者の事業承継・M&Aに特化したマッチングプラットフォームをいいます。</li>
            <li>②　「譲渡者」とは、本サービスに事業の売却・譲渡を希望して掲載を行う者をいいます。</li>
            <li>③　「譲受者」とは、本サービスを通じて事業の取得・承継を希望する者をいいます。</li>
            <li>④　「ユーザー」とは、譲渡者および譲受者を総称していいます。</li>
            <li>⑤　「成約」とは、本サービスを通じて知り合った譲渡者と譲受者の間で、事業の譲渡・売買・承継に関する契約が締結されることをいいます。</li>
          </ol>
        </section>

        {/* 第2条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第2条（利用登録）
          </h2>
          <p className="mb-3">
            本サービスの利用を希望する者は、本規約に同意したうえで、運営者が定める方法により利用登録を行うものとします。
          </p>
          <p className="mb-3">2　運営者は、利用登録の申請者が以下の各号のいずれかに該当する場合、利用登録を拒否することがあります。</p>
          <ol className="space-y-2 pl-5">
            <li>①　本規約に違反したことがある者からの申請である場合</li>
            <li>②　虚偽の情報を登録した場合</li>
            <li>③　その他、運営者が利用登録を適当でないと判断した場合</li>
          </ol>
        </section>

        {/* 第3条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第3条（サービスの内容）
          </h2>
          <p className="mb-3">
            本サービスは、譲渡者と譲受者の出会いの場を提供するマッチングプラットフォームです。運営者は、事業の譲渡・売買・承継に関する契約の当事者とはなりません。
          </p>
          <p className="mb-3">2　本サービスが提供する主な機能は以下のとおりです。</p>
          <ol className="space-y-2 pl-5">
            <li>①　事業売却・譲渡情報の掲載</li>
            <li>②　プラットフォーム上でのメッセージ機能</li>
            <li>③　案件の検索・閲覧機能</li>
          </ol>
        </section>

        {/* 第4条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第4条（手数料）
          </h2>
          <p className="mb-4">
            本サービスを通じて成約した場合、ユーザーは以下の手数料を運営者に支払うものとします。
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-800 text-white">
                  <th className="border border-green-700 px-4 py-3 text-left">区分</th>
                  <th className="border border-green-700 px-4 py-3 text-center">手数料率</th>
                  <th className="border border-green-700 px-4 py-3 text-center">最低手数料</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50">
                  <td className="border border-green-200 px-4 py-3">譲渡者（売り手）</td>
                  <td className="border border-green-200 px-4 py-3 text-center text-gray-400" colSpan={2}>無料</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-green-200 px-4 py-3">譲受者（買い手）</td>
                  <td className="border border-green-200 px-4 py-3 text-center font-semibold" colSpan={2}>60,000円（成約時のみ）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-2">2　手数料は、成約が確定した時点で発生し、成約後14日以内に運営者が指定する方法により支払うものとします。</p>
          <p>4　支払済みの手数料は、いかなる理由によっても返還しません。</p>
        </section>

        {/* 第5条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第5条（プラットフォーム外取引の禁止）
          </h2>
          <p className="mb-3">
            ユーザーは、本サービスを通じて知り合った相手方と、本サービスのプラットフォーム外において直接交渉・成約（以下「場外取引」）を行ってはなりません。
          </p>
          <p className="mb-3">2　場外取引が発覚した場合、運営者は当該ユーザーに対し、以下の措置を取ることができます。</p>
          <ol className="space-y-2 pl-5 mb-3">
            <li>①　成約金額に対する規定の手数料相当額の損害賠償請求</li>
            <li>②　本サービスの利用停止またはアカウントの強制退会</li>
            <li>③　その他、運営者が適切と判断する措置</li>
          </ol>
          <p>3　場外取引による成約の場合も、第4条に定める手数料の支払義務は免れないものとします。</p>
        </section>

        {/* 第6条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第6条（禁止事項）
          </h2>
          <p className="mb-3">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
          <ol className="space-y-2 pl-5">
            <li>①　虚偽の情報を登録・掲載する行為</li>
            <li>②　他のユーザーを欺く行為または不正な取引を誘導する行為</li>
            <li>③　本サービスを通じて知り合ったユーザーの個人情報・連絡先を第三者に開示する行為</li>
            <li>④　運営者の事前の許可なく、本サービスを営利目的で利用する行為（転売・仲介等）</li>
            <li>⑤　本サービスのシステムに不正にアクセスする行為</li>
            <li>⑥　法令または公序良俗に違反する行為</li>
            <li>⑦　その他、運営者が不適切と判断する行為</li>
          </ol>
        </section>

        {/* 第7条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第7条（個人情報の取り扱い）
          </h2>
          <p className="mb-3">
            運営者は、本サービスの利用を通じて取得したユーザーの個人情報を、プライバシーポリシーに基づき適切に管理します。
          </p>
          <p>
            2　運営者は、ユーザーの個人情報を、本サービスの運営・提供に必要な範囲においてのみ利用し、法令に基づく場合を除き、第三者に提供しません。
          </p>
        </section>

        {/* 第8条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第8条（免責事項）
          </h2>
          <p className="mb-3">
            本サービスは、譲渡者と譲受者の出会いの場を提供するものであり、成約の成立および取引内容の正確性、事業の収益性・将来性等を保証するものではありません。
          </p>
          <p className="mb-3">
            2　ユーザー間で発生したトラブル（表明保証違反、代金不払い等）については、当事者間で解決するものとし、運営者は一切の責任を負いません。
          </p>
          <p>
            3　運営者は、本サービスの停止・中断・変更・廃止によってユーザーに生じた損害について、一切の責任を負いません。
          </p>
        </section>

        {/* 第9条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第9条（サービスの変更・停止）
          </h2>
          <p className="mb-3">
            運営者は、ユーザーへの事前通知なく、本サービスの内容を変更し、または提供を停止・廃止することがあります。
          </p>
          <p>
            2　運営者は、前項による変更・停止・廃止によってユーザーに生じた損害について、一切の責任を負いません。
          </p>
        </section>

        {/* 第10条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第10条（規約の変更）
          </h2>
          <p className="mb-3">
            運営者は、必要と判断した場合、本規約を変更することができます。変更後の規約は、本サービス上に掲示した時点より効力を生じるものとします。
          </p>
          <p>
            2　変更後も本サービスを継続利用したユーザーは、変更後の規約に同意したものとみなします。
          </p>
        </section>

        {/* 第11条 */}
        <section>
          <h2 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2 mb-4">
            第11条（準拠法・管轄裁判所）
          </h2>
          <p className="mb-3">本規約の解釈にあたっては、日本法を準拠法とします。</p>
          <p>
            2　本サービスに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <p className="text-right text-sm text-gray-400 pt-4 border-t border-gray-100">
          以上<br />2026年3月21日　制定
        </p>
      </div>
    </div>
  )
}
