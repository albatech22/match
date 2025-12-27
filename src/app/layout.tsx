import type { Metadata } from 'next'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import './globals.css'
import '../styles/adblocker.css'
import ClientLayout from '@/components/layout/ClientLayout'

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
  metadataBase: new URL('https://kivustream.live'),
  title: {
    default: 'Kivu Stream | Scores de Football en Direct & Streaming',
    template: '%s | Kivu Stream'
  },
  description: 'Suivez les scores de football en direct, résultats, classements et statistiques détaillées. La référence pour le foot africain et international.',
  applicationName: 'Kivu Stream',
  authors: [{ name: 'Kivu Stream Team' }],
  keywords: ['football', 'scores en direct', 'livescore', 'ligue des champions', 'premier league', 'linafoot', 'rdc football', 'streaming foot'],
  referrer: 'origin-when-cross-origin',
  creator: 'Kivu Stream',
  publisher: 'Kivu Stream',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://kivustream.live',
    siteName: 'Kivu Stream',
    title: 'Kivu Stream | Scores de Football en Direct & Streaming',
    description: 'Suivez les scores de football en direct, résultats, classements et statistiques détaillées.',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kivu Stream - Football Live Scores & Streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kivu Stream | Scores de Football en Direct',
    description: 'Suivez les scores de football en direct, résultats et classements.',
    creator: '@kivustream',
    images: ['/assets/images/twitter-card.png'],
  },
  icons: {
    icon: [
      { url: '/assets/images/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/assets/images/icon-512.png',
    apple: '/assets/images/icon-512.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="bg-black">
      <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-body bg-[#050505] text-primary antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
