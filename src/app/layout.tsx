import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {LanguageProvider} from '@/context/LanguageContext';
import {FirebaseErrorListener} from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dhanwanthrimaruthuvam.com'),
  title: {
    default: 'Dhanwanthri Maruthuvam | Best Ayurvedic & Sports Therapy Clinic in Chennai',
    template: '%s | Dhanwanthri Maruthuvam'
  },
  description: 'Dhanwanthri Maruthuvam (Dhanwanthiri Hospital) is Chennai\'s premier clinic for Integrative Sports Medicine and Ayurveda. Led by Dr. Dharmesh Kubendiran (BAMS, PhD), specializing in Kinesiology, Dry Needling, and Osteopathic Manipulation for chronic pain and sports recovery.',
  keywords: [
    'Dhanwanthiri Hospital',
    'Dhanwanthiri Maruthuvam',
    'Dhanwanthri Maruthuvam',
    'Dr. Dharmesh',
    'Dr. Dharmesh Kubendiran',
    'Sports Therapy Chennai',
    'Ayurveda Chennai',
    'Dry Needling Chennai',
    'Kinesiology Chennai',
    'Osteopathic Manipulation Chennai',
    'Pain Management Ashok Nagar',
    'Sports Rehabilitation Chennai',
    'Integrative Medicine Chennai',
    'Traditional Healing Chennai',
    'Modern Recovery Chennai',
    'Joint Manipulation Chennai',
    'Gait Analysis Chennai',
    'HBOT Chennai',
    'Hyperbaric Oxygen Therapy Chennai',
    'Panchakarma Chennai',
    'Best Ayurveda Doctor Chennai',
    'Siddha Medicine Chennai'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dhanwanthri Maruthuvam | Ancient Wisdom, Modern Recovery',
    description: 'Specialized Ayurvedic and Sports Therapy clinic in Ashok Nagar, Chennai. Expert pain management and rehabilitation by Dr. Dharmesh Kubendiran.',
    url: 'https://www.dhanwanthrimaruthuvam.com',
    siteName: 'Dhanwanthri Maruthuvam',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Images%2FLanding%20page%20hero%20image.webp?alt=media&token=6b702b7d-29eb-4921-affc-6193ed9fcd49',
        width: 1200,
        height: 630,
        alt: 'Dhanwanthri Maruthuvam Clinic'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhanwanthri Maruthuvam | Sports Therapy & Ayurveda',
    description: 'Holistic pain management and athletic recovery in Chennai.',
    images: ['https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Images%2FLanding%20page%20hero%20image.webp?alt=media&token=6b702b7d-29eb-4921-affc-6193ed9fcd49'],
  },
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FFavicon-dhanwanthiri.webp?alt=media&token=622c5a27-8aa9-40a8-beeb-76dfd3f97cd2',
  },
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
          <FirebaseErrorListener />
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
