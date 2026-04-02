
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {
  const whiteLogoUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FWhite%20Logo-footer.webp?alt=media&token=e7619c5f-8a15-40f6-8a31-e5bc9a233cc5";

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Upper CTA Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-headline font-bold">Ready to start your recovery?</h3>
            <p className="text-primary-foreground/70">Expert consultation available 7 days a week.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="rounded-full px-8 font-bold bg-white text-primary hover:bg-white/90">
              <Link href="/contact">Book Your Visit</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary-foreground/30 hover:bg-primary-foreground/10">
              <Link href="/qa">Ask Our AI</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center md:text-left">
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <Link href="/" className="flex items-center group">
            <div className="relative h-34 w-68 bg-white/5 rounded-2xl p-4 transition-transform hover:scale-105 duration-300">
              {/* Logo size increased by 20% (Approx 230x115) to maintain 2:1 (1080x520 is ~2:1) */}
              <Image 
                src={whiteLogoUrl}
                alt="Dhanwanthri Healing Logo"
                width={230}
                height={115}
                className="object-contain"
              />
            </div>
          </Link>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
            Bridging the gap between ancient Ayurvedic wisdom and modern sports medicine. Our mission is to restore peak human performance through scientific movement analysis and holistic therapies.
          </p>
          <div className="flex gap-3">
            <Link href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Services Column */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold uppercase tracking-widest text-white/60 text-sm">Treatments</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/70">
            {[
              { name: 'Advanced Kinesiology', href: '/services#kinesiology' },
              { name: 'Dry Needling Therapy', href: '/services#needling' },
              { name: 'Osteopathic Manipulation', href: '/services#manipulation' },
              { name: 'HBOT & Recovery', href: '/services#hbot' },
              { name: 'Ayurveda Panchakarma', href: '/services#ayurveda' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white flex items-center justify-center md:justify-start gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all hidden md:block" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information Column */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold uppercase tracking-widest text-white/60 text-sm">Information</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/70">
            {[
              { name: 'Meet Dr. Dharmesh', href: '/about' },
              { name: 'Clinical Gallery', href: '/gallery' },
              { name: 'FAQ & AI Insights', href: '/qa' },
              { name: 'Patient Privacy', href: '#' },
              { name: 'Terms of Care', href: '#' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white flex items-center justify-center md:justify-start gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all hidden md:block" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold uppercase tracking-widest text-white/60 text-sm">Connect</h4>
          <ul className="space-y-6 text-sm">
            <li className="flex flex-col items-center md:flex-row md:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-primary-foreground/70">
                <p className="font-bold text-primary-foreground">Chennai Clinic</p>
                <p>Tamil Nadu, India</p>
              </div>
            </li>
            <li className="flex flex-col items-center md:flex-row md:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-primary-foreground/70">
                <p className="font-bold text-primary-foreground">+91 XXX XXX XXXX</p>
                <p>Clinic Desk</p>
              </div>
            </li>
            <li className="flex flex-col items-center md:flex-row md:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-primary-foreground/70">
                <p className="font-bold text-primary-foreground">Email Inquiries</p>
                <p className="truncate">care@dhanwanthri.com</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50 text-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Accredited Facility</span>
            <span>&copy; {new Date().getFullYear()} Dhanwanthri Maruthuvam Ayurvedic & Sports Therapy</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Cookie Settings</Link>
            <Link href="#" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
