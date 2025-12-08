import { Inter, Lusitana, Blinker } from 'next/font/google';
import localFont from 'next/font/local'

export const pretendard = localFont({ src: './Pretendard-Regular.woff2' })

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
  });

export const blinker = Blinker({ 
  weight: '600',
  subsets: ['latin'] 
});
