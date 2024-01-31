import '@/app/ui/global.css';
import { blinker } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | economins',
    default: 'economins',
  },
  description: 'The economic metric visualization.',
  metadataBase: new URL('https://github.com/ho9science/economins'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${blinker.className} antialiased bg-slate-50`}>{children}
        <footer className={`${blinker.className} my-3 m-auto max-w-screen-2xl`}>
          copyright © 2024 economins. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
