import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from '../components/NavBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chunithm Singapore Tournament 2023',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} py-8 px-4 max-w-xl flex flex-col justify-center m-auto`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
