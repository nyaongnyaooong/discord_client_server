import './globals.css'
import { Inter } from 'next/font/google'
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  axios.defaults.withCredentials = true;
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}