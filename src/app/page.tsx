
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Activity, 
  Zap, 
  Sparkles, 
  Clock, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-clinic');
  const heroMobileImg = PlaceHolderImages.find(img => img.id === 'hero-mobile');
  const interiorImg = PlaceHolderImages.find(i => i.id === 'interior-lobby');
  
  const faviconUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FFavicon-dhanwanthiri.webp?alt=media&token=622c5a27-8aa9-40a8-beeb-76dfd3f97cd2";

  const services = [
    {
      title: 'Advanced Kinesiology',
      desc: 'Scientific study of human body movement to correct imbalances.',
      icon: Activity,
      color: 'bg-primary/10 text-primary',
      link: '/services#kinesiology'
    },
    {
      title: 'Dry Needling',
      desc: 'Modern clinical treatment for muscular pain and trigger points.',
      icon: Zap,
      color: 'bg-primary/10 text-primary',
      link: '/services#needling'
    },
    {
      title: 'Joint Manipulation',
      desc: 'HVLA thrust techniques to restore full range of motion.',
      icon: Stethoscope,
      color: 'bg-primary/10 text-primary',
      link: '/services#manipulation'
    },
    {
      title: 'Sports Therapy',
      desc: 'Comprehensive rehab for athletes to reach peak efficiency.',
      icon: UserCheck,
      color: 'bg-primary/10 text-primary',
      link: '/services#sports'
    }
  ];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] md:min-h-[700px] flex items-end pb-12 md:pb-0 md:items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          {heroImg && (
            <div className="hidden md:block absolute inset-0">
              <Image
                src={heroImg.imageUrl}
                alt={heroImg.description}
                fill
                className="object-cover opacity-100"
                priority
                data-ai-hint={heroImg.imageHint}
              />
            </div>
          )}
          {heroMobileImg && (
            <div className="block md:hidden absolute inset-0">
              <Image
                src={heroMobileImg.imageUrl}
                alt={heroMobileImg.description}
                fill
                className="object-cover opacity-100"
                priority
                data-ai-hint={heroMobileImg.imageHint}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 md:via-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
          <div className="max-w-2xl space-y-4 md:space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000 scale-90 md:scale-100 origin-bottom-left">
            <div className="inline-flex items-center gap-2 bg-primary px-3 py-1 md:px-4 md:py-1.5 rounded-full text-white font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg">
              <Sparkles className="h-3 w-3 md:h-3.5" />
              {t.hero.badge}
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold font-headline leading-[1.1] text-white">
                {t.hero.title1} <br />
                <span className="text-primary italic">{t.hero.title2}</span>
              </h1>
              <p className="text-sm md:text-xl text-white/90 font-body max-w-lg leading-relaxed drop-shadow-sm">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 text-sm md:text-lg h-10 md:h-14 rounded-full shadow-xl shadow-primary/20">
                <Link href="/contact">{t.hero.ctaBook}</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 md:px-8 text-sm md:text-lg h-10 md:h-14 rounded-full shadow-xl transition-all">
                <Link href="/services">{t.hero.ctaServices}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-left">
          <h2 className="text-3xl font-headline font-bold text-primary">{t.home.overviewTitle}</h2>
          <p className="text-lg leading-relaxed text-foreground/70">
            {t.home.overviewDesc}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/10">
              <h4 className="font-bold text-primary flex items-center gap-2 text-left">
                <Clock className="h-4 w-4" /> {t.home.hours}
              </h4>
              <p className="text-sm text-foreground/60 text-left">{t.home.hoursVal}</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/10">
              <h4 className="font-bold text-primary flex items-center gap-2 text-left">
                <Sparkles className="h-4 w-4" /> {t.home.capacity}
              </h4>
              <p className="text-sm text-foreground/60 text-left">{t.home.capacityVal}</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
          {interiorImg && (
            <Image
              src={interiorImg.imageUrl}
              alt="Clinic Interior"
              fill
              className="object-cover"
              data-ai-hint="clinic lobby"
            />
          )}
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-muted/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold text-primary">{t.home.servicesTitle}</h2>
            <p className="text-foreground/60 text-lg">
              {t.home.servicesDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-headline font-bold text-left">{service.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed text-left">
                    {service.desc}
                  </p>
                  <Link 
                    href={service.link} 
                    className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all"
                  >
                    Learn More <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrading News */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Image 
              src={faviconUrl}
              alt="Dhanwanthri Icon"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-6">{t.home.upgradeTitle}</h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            {t.home.upgradeDesc}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8">
              <Link href="/gallery">{t.home.tourBtn}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
