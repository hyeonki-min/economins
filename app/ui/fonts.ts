import { Inter, Lusitana, Blinker } from 'next/font/google';
import localFont from 'next/font/local'

export const nanumsquare = localFont({ src: './NanumSquareNeo-aLt.woff' })

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
  });

export const blinker = Blinker({ 
  weight: '600',
  subsets: ['latin'] 
});
