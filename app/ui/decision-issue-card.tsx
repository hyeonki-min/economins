export function highlightNumbers(text: string) {
  return text.replace(
    /(\d[\d.,]*\s?(?:%|bp|p|조|억|만|원)?)/g,
    '<span class="highlight-number">$1</span>'
  );
}

export default function DecisionIssueCard({
  koreanDate,
  decisions,
  issues,
}: {
  koreanDate: string;
  decisions: { title?: string; summary?: string[] }[];
  issues: { title?: string; summary?: string[] }[];
}) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-md shadow-md border bg-white p-4 md:p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
            <span>{koreanDate}</span>
            <br className="block md:hidden" />
            <span className="md:ml-2 font-semibold">
            통화정책방향 결정회의 요약
            </span>
        </h1>

        {/* Decision Section */}
        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
            결정문
        </h2>

        <div className="space-y-3">
            {decisions.map((item, idx) => (
            <details
                key={idx}
                className="rounded-lg shadow-sm max-w-prose"
            >
                <summary className="px-4 py-3 cursor-pointer text-lg font-bold hover:bg-gray-50 transition">
                {item.title}
                </summary>

                <div className="px-4 py-4 bg-gray-50 text-gray-600 whitespace-pre-line leading-relaxed">
                    <ul className="space-y-2 list-disc list-inside">
                    {item.summary?.map((s, idx) => (
                        <li key={idx} className="text-base"
                            dangerouslySetInnerHTML={{ __html: highlightNumbers(s?s:"") }}
                        ></li>
                    ))}
                    </ul>
                </div>
            </details>
            ))}
        </div>

        {/* Issue Section */}
        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
            금융 경제 이슈
        </h2>

        <div className="space-y-3">
            {issues.map((item, idx) => (
            <details
                key={idx}
                className="rounded-lg shadow-sm max-w-prose"
            >
                <summary className="px-4 py-3 cursor-pointer text-lg font-medium hover:bg-gray-50 transition">
                {item.title}
                </summary>

                <div className="px-4 py-4 bg-gray-50 text-gray-600 whitespace-pre-line leading-relaxed">
                    <ul className="space-y-2 list-disc list-inside">
                    {item.summary?.map((s, idx) => (
                        <li key={idx} className="text-base"
                            dangerouslySetInnerHTML={{ __html: highlightNumbers(s?s:"") }}
                        ></li>
                    ))}
                    </ul>
                </div>
            </details>
            ))}
        </div>

        <div className="mt-10 pt-4 border-t text-sm text-gray-500 flex justify-end">
            <a 
                href={'https://www.bok.or.kr/portal/singl/crncyPolicyDrcMtg/listYear.do?mtgSe=A&menuNo=200755'}
                target="_blank"
                className="hover:text-blue-600 hover:underline"
            >
                원본 보기 (한국은행 공식 보도자료) ↗
            </a>
        </div>
    </div>
  );
}

