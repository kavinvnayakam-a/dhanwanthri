
import { HeartPulse, Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-accent" />
            <span className="font-headline font-bold text-xl tracking-tighter">DHANWANTHRI</span>
          </div>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Premium Ayurvedic and Sports Therapy clinic in Chennai. Specializing in traditional Ayush medicine integrated with advanced sports rehabilitation.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-lg">Services</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/services#kinesiology" className="hover:text-accent">Advanced Kinesiology</Link></li>
            <li><Link href="/services#needling" className="hover:text-accent">Dry Needling</Link></li>
            <li><Link href="/services#manipulation" className="hover:text-accent">Joint Manipulation</Link></li>
            <li><Link href="/services#ayurveda" className="hover:text-accent">Ayurveda Panchakarma</Link></li>
            <li><Link href="/services#hbot" className="hover:text-accent">HBOT & Hydrocolon</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-lg">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/about" className="hover:text-accent">Dr. Dharmesh Kubendiran</Link></li>
            <li><Link href="/gallery" className="hover:text-accent">Clinic Gallery</Link></li>
            <li><Link href="/qa" className="hover:text-accent">Ask AI Assistant</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Book Appointment</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-lg">Contact Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="h-5 w-5 shrink-0 text-accent" /> Chennai, Tamil Nadu, India</li>
            <li className="flex gap-2"><Phone className="h-5 w-5 shrink-0 text-accent" /> +91 XXX XXX XXXX</li>
            <li className="flex gap-2"><Mail className="h-5 w-5 shrink-0 text-accent" /> info@dhanwanthrihealing.com</li>
            <li className="text-xs mt-2 border-t border-primary-foreground/20 pt-2">Open 7 AM - 9 PM, Mon - Sun</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/60">
        &copy; {new Date().getFullYear()} Dhanwanthri Healing. All rights reserved.
      </div>
    </footer>
  );
}
