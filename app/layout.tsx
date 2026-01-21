import type { Metadata } from 'next';
import './globals.css';
import { Inter, Noto_Sans_SC, Playfair_Display } from 'next/font/google';
import ThemeClient from '@/components/ThemeClient';
import type React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const noto = Noto_Sans_SC({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--font-noto' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Moments of Truth | MOT 关键时刻互动练习',
  description: 'MOT 关键时刻（Explore-Offer-Action-Confirm）交互式训练：AI 扮演客户，MOT 专家给出评分与改进建议。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${noto.variable} ${playfair.variable} font-sans`}
      >
        <ThemeClient />
        {children}
      </body>
    </html>
  );
}
