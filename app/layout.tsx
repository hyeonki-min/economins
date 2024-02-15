import '@/app/ui/global.css';
import { blinker } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    template: '%s | economins',
    default: 'economins',
  },
  description: '대한민국 경제 지표 시각화 정보를 제공합니다.',
  metadataBase: new URL('https://github.com/ho9science/economins'),
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
