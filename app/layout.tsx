import '@/app/ui/global.css';
import { blinker } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    template: '%s | economins',
    default: '경제 데이터 시각화 비교 플랫폼 - economins',
  },
  openGraph: {
    description: '대한민국 기준금리 vs 부동산 실거래가 등 거시경제 지표를 시각적으로 비교하는 서비스'
  },
  description: '대한민국 기준금리 vs 부동산 실거래가 등 거시경제 지표를 시각적으로 비교하는 서비스',
  metadataBase: new URL('https://economins.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en">
      <body className={`${blinker.className} antialiased bg-slate-50`}>{children}
        <footer className={`${blinker.className} my-3 m-auto max-w-screen-2xl`}>
          copyright © {currentYear} economins. All rights reserved.
        </footer>
      </body>
      <GoogleTagManager gtmId="GTM-KXQRLLCL" />
    </html>
  );
}
