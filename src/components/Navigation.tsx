
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FDhanwanthiri%20Logo.webp?alt=media&token=31a8ab0e-c431-4ea5-a513-324d630ebce4";

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
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Dr. Dharmesh', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'AI Q&A', href: '/qa' },
  ];

  // Prevent hydration mismatch by rendering a consistent height shell
  const isActuallyScrolled = mounted && scrolled;

  return (
    <>
      {/* Spacer to prevent content jump - Matches the max header height */}
      <div className="h-28 md:h-36 w-full shrink-0" />
      
      <nav 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out border-b bg-background",
          isActuallyScrolled 
            ? "py-2 shadow-md backdrop-blur-md bg-background/95" 
            : "py-4 md:py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Increased size with 2:1 aspect ratio */}
            <Link href="/" className="flex items-center group">
              <div className={cn(
                "relative transition-all duration-500 ease-in-out",
                isActuallyScrolled ? "h-16 w-32 md:h-20 md:w-40" : "h-24 w-48 md:h-28 md:w-56"
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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
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
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md shadow-primary/20">
                <Link href="/contact" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="text-primary">
                 <Link href="tel:+91XXXXXXXXXX"><PhoneCall className="h-5 w-5" /></Link>
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-background border-t animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
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
                  <Link href="/contact" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
