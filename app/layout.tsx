import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Open_Sans, Titillium_Web } from 'next/font/google'
import { FilterProvider } from '@/components/providers/filter-provider'
import { FloatingActions } from '@/components/common/floating-actions'
import './globals.css'

const titilliumWeb = Titillium_Web({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  variable: '--font-serif-heading',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vistaar Estate | Luxury Real Estate',
  description:
    'Curating the world&apos;s most exceptional homes. Discover premium villas, penthouses, and estates with white-glove service.',
  generator: 'Vistaar Estate',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${titilliumWeb.variable} ${openSans.variable} bg-background`}>
      <body className="antialiased">
        <FilterProvider>
          {children}
          <FloatingActions />
        </FilterProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}