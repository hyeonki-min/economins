import '@/app/ui/global.css';
import { blinker } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Header from '@/app/ui/header/Header';
import type { ReactNode } from 'react'
import GTM from '@/app/ui/gtm'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'


export const metadata: Metadata = {
  title: {
    template: '%s | economins',
    default: '경제 흐름을 한눈에 보는 경제 지표 시각화 플랫폼',
  },
  openGraph: {
    description: '기준금리·물가·환율·주택가격 등 주요 경제 지표를 시각적으로 비교해 지금의 경제 흐름을 빠르게 이해할 수 있는 서비스입니다.'
  },
  description: '기준금리·물가·환율·주택가격 등 주요 경제 지표를 시각적으로 비교해 지금의 경제 흐름을 한눈에 파악하세요.',
  metadataBase: new URL('https://economins.com'),
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en">
      <body className={`${blinker.className} min-h-screen antialiased bg-slate-50`}>
        <Header />
        {children}
        <GTM />
        <footer className={`${blinker.className} my-3 m-auto max-w-screen-2xl px-4 text-sm sm:px-6 lg:px-8`}>
          copyright © {currentYear} economins. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
