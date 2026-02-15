import type { Metadata } from 'next'
import LifeSimulatorClient from '@/app/ui/simulator/life-simulator'

export const metadata: Metadata = {
  title: '인생 재무 시뮬레이터 | 연봉 · 소비 · 주거 시나리오',
  description:
    '연봉, 소비율, 결혼, 자녀, 주거 형태를 바탕으로 은퇴까지의 자산 흐름을 시뮬레이션해보세요.',
  keywords: [
    '재무 시뮬레이터',
    '인생 설계',
    '연봉 시뮬레이션',
    '은퇴 자산',
    '소비율 계산',
    '주거 계획',
  ],
  openGraph: {
    title: '인생 재무 시뮬레이터',
    description:
      '나의 인생 선택이 자산에 어떤 영향을 주는지 시각적으로 확인하세요.',
    url: 'https://economins.com/simulator',
    siteName: 'economins',
    type: 'website',
  },
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <header className="hidden sm:block mb-4 sm:mb-10 md:mb-6 space-y-2 sm:space-y-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
          인생 재무 시뮬레이터
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          연봉, 소비, 주거, 가족 계획을 기반으로 은퇴까지의 재무 흐름을 시뮬레이션합니다.
        </p>
      </header>

      <LifeSimulatorClient />
    </main>
  )
}
