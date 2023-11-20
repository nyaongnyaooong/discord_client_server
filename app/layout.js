import './globals.css'
import { Inter } from 'next/font/google'
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Discord clone for practice',
  description: '학습용 디스코드 클론 사이트',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
