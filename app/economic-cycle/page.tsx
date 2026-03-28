import { XYPoint } from "@/app/lib/definitions";
import { fetchDataset } from "@/app/lib/fetch-data";
import PhaseViewer from "./phase-viewer"

export const metadata = {
  title: "경제 국면 분석 | 지금은 고성장일까 침체일까?",
  description:
    "물가와 경기 데이터를 기반으로 현재 경제 국면을 시각적으로 확인하세요. 고성장·저물가(골디락스), 스태그플레이션, 침체 등 각 국면에 따라 주식·채권·금·원자재 흐름을 한눈에 이해할 수 있습니다.",
  keywords: [
    "경제 국면",
    "골디락스",
    "스태그플레이션",
    "경기 사이클",
    "CPI",
    "선행지수",
    "주식 채권 전망",
  ],
}

export default async function Page() {
  const [cpiData, cliData] = await Promise.all([
      fetchDataset<XYPoint>(`data/cpi-korea`),
      fetchDataset<XYPoint>(`data/cyclical-component-of-leading-index-korea`),
    ]);
  return (
    <main className="text-gray-900">

      <section className="text-center py-6 md:py-16 px-4">

        <h1 className="text-3xl font-bold leading-tight">
          지금 경제는 어디에 있을까?
        </h1>

        <p className="mt-4 text-gray-600 mx-auto leading-relaxed">
          물가(CPI)와 경기선행지수를 기반으로 현재 경제 위치를 시각화했습니다.
        </p>

        <p className="sr-only">
          소비자물가지수와 경기선행지수를 기반으로 경제 사이클을 분석합니다.
          골디락스, 스태그플레이션, 경기 침체 등 다양한 경제 국면과 자산 흐름을 설명합니다.
        </p>

      </section>

      {/* 핵심 */}
      <PhaseViewer cpiData={cpiData} cliData={cliData}/>

    </main>
  )
}