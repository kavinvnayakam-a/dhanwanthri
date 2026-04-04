
import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {LanguageProvider} from '@/context/LanguageContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dhanwanthrimaruthuvam.com'),
  title: {
    default: 'Dhanwanthri Maruthuvam | Ayurvedic & Sports Therapy Clinic Chennai',
    template: '%s | Dhanwanthri Maruthuvam'
  },
  description: 'Premium Ayurvedic and Advanced Sports Therapy clinic in Chennai. Dr. Dharmesh Kubendiran (BAMS, PhD) specializes in Kinesiology, Dry Needling, and Osteopathic Manipulation for holistic pain management.',
  keywords: ['Ayurveda Chennai', 'Sports Therapy Chennai', 'Dry Needling Chennai', 'Kinesiology', 'Osteopathic Manipulation', 'Dr. Dharmesh Kubendiran', 'Pain Management Chennai'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dhanwanthri Maruthuvam | Ayurvedic & Sports Therapy',
    description: 'Ancient Wisdom, Modern Recovery. Holistic pain management and sports rehabilitation in Ashok Nagar, Chennai.',
    url: 'https://www.dhanwanthrimaruthuvam.com',
    siteName: 'Dhanwanthri Maruthuvam',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FFavicon-dhanwanthiri.webp?alt=media&token=622c5a27-8aa9-40a8-beeb-76dfd3f97cd2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
