import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { FeatureFlagProvider } from '@/components/providers/FeatureFlagProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Moving Suppliers Hub',
    default: 'Moving Suppliers Hub - Connect with UK Moving Industry Suppliers'
  },
  description: 'Discover and connect with verified UK suppliers for moving companies. Compare services, read reviews, and find the best partners for insurance, software, equipment, and more.',
  keywords: ['moving companies', 'UK suppliers', 'moving industry', 'insurance', 'fleet management', 'packing supplies'],
  authors: [{ name: 'Moving Suppliers Hub' }],
  creator: 'Moving Suppliers Hub',
  publisher: 'Moving Suppliers Hub',
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
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://movingsuppliershub.com',
    siteName: 'Moving Suppliers Hub',
    title: 'Moving Suppliers Hub - Connect with UK Moving Industry Suppliers',
    description: 'Discover and connect with verified UK suppliers for moving companies. Compare services, read reviews, and find the best partners.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moving Suppliers Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moving Suppliers Hub - Connect with UK Moving Industry Suppliers',
    description: 'Discover and connect with verified UK suppliers for moving companies.',
    images: ['/images/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/hero-bg.jpg" as="image" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <ErrorBoundary>
          <AuthProvider>
            <FeatureFlagProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                
                <main className="flex-1">
                  {children}
                </main>
                
                <Footer />
              </div>
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </FeatureFlagProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
