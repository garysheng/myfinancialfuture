import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyFinancialFuture',
  description: 'Plan your financial future with confidence',
  metadataBase: new URL('https://myfinancialfuture.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'MyFinancialFuture',
    description: 'Discover exactly how much you need to earn for the lifestyle you want',
    siteName: 'MyFinancialFuture',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyFinancialFuture - Plan your financial future with confidence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyFinancialFuture',
    description: 'Discover exactly how much you need to earn for the lifestyle you want',
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
