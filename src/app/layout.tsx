import type { Metadata } from 'next'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import './globals.css'
import '../styles/adblocker.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-poppins'
})
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono'
})

export const metadata: Metadata = {
  title: 'Kivu Stream - Next Gen Sports Streaming',
  description: 'Experience sports streaming like never before with Kivu Stream.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-body bg-main text-primary antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
