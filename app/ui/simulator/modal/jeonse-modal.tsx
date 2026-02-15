export default function JeonseModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        전세는 월 주거비 부담이 적은 대신,
        <span className="font-medium"> 큰 금액의 보증금이 장기간 묶이는</span>
        주거 방식입니다.
      </p>

      <p className="text-sm text-slate-700 leading-relaxed">
        이 시뮬레이션에서는 전세보증금을
        <span className="font-medium"> 투자에 사용할 수 없는 자산</span>으로
        처리합니다.
        그 결과, 예·적금이나 ETF에 투자되는 금액이 줄어들어
        장기 자산 성장 속도가 낮아집니다.
      </p>

      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 전세는 지출을 줄이는 선택이지만,
        투자 수익의 기회비용이 발생할 수 있음을
        단순화해 표현한 가정입니다.
      </p>
    </div>
  )
}
