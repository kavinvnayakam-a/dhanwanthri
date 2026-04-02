
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FDhanwanthiri%20Logo.webp?alt=media&token=31a8ab0e-c431-4ea5-a513-324d630ebce4";

  // WhatsApp Config
  const whatsappNumber = "918608174673";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t.contact.whatsappMsg)}`;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.services, href: '/services' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.gallery, href: '/gallery' },
    { name: t.nav.qa, href: '/qa' },
    { name: 'Contact', href: '/contact' },
  ];

  if (!mounted) return <div className="h-20 md:h-24 w-full" />;

  return (
    <>
      <div className="h-28 md:h-36 w-full shrink-0" />
      
      <nav 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out border-b bg-background",
          scrolled 
            ? "py-2 shadow-md backdrop-blur-md bg-background/95" 
            : "py-4 md:py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center group">
              <div className={cn(
                "relative transition-all duration-500 ease-in-out",
                scrolled ? "h-20 w-40 md:h-24 md:w-48" : "h-28 w-56 md:h-32 md:w-64"
              )}>
                <Image 
                  src={logoUrl}
                  alt="Dhanwanthri Healing Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200",
                    pathname === link.href 
                      ? "text-primary bg-primary/5" 
                      : "text-foreground/60 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-border mx-4" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-2 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white"
              >
                <Globe className="h-4 w-4" />
                <span className="font-bold">{language === 'en' ? 'அ' : 'EN'}</span>
              </Button>

              <div className="h-6 w-px bg-border mx-4" />
              
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md shadow-primary/20">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{t.nav.book}</span>
                </a>
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="text-primary rounded-full border border-primary/20 h-10 w-10 flex items-center justify-center font-bold"
              >
                {language === 'en' ? 'அ' : 'EN'}
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground/70 hover:text-primary transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-background border-t animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-base font-bold rounded-xl transition-colors",
                    pathname === link.href 
                      ? "text-primary bg-primary/5" 
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t mt-4">
                <Button asChild className="w-full bg-primary py-6 text-lg rounded-2xl">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                    {t.nav.book}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
