
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
  Wind, 
  Activity, 
  Syringe, 
  Move, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      id: 'kinesiology',
      title: t.services.kinesiology.title,
      description: t.services.kinesiology.desc,
      image: 'gallery-2',
      icon: Move,
      points: [
        t.services.kinesiology.p1,
        t.services.kinesiology.p2,
        t.services.kinesiology.p3,
        t.services.kinesiology.p4,
        t.services.kinesiology.p5,
      ]
    },
    {
      id: 'needling',
      title: t.services.needling.title,
      description: t.services.needling.desc,
      image: 'gallery-4',
      icon: Syringe,
      points: [
        t.services.needling.p1,
        t.services.needling.p2,
        t.services.needling.p3,
        t.services.needling.p4,
        t.services.needling.p5,
      ]
    },
    {
      id: 'manipulation',
      title: t.services.manipulation.title,
      description: t.services.manipulation.desc,
      image: 'gallery-5',
      icon: Activity,
      points: [
        t.services.manipulation.p1,
        t.services.manipulation.p2,
        t.services.manipulation.p3,
        t.services.manipulation.p4,
        t.services.manipulation.p5,
      ]
    },
    {
      id: 'hbot',
      title: t.services.hbot.title,
      description: t.services.hbot.desc,
      image: 'gallery-10',
      icon: Wind,
      points: [
        t.services.hbot.p1,
        t.services.hbot.p2,
        t.services.hbot.p3,
        t.services.hbot.p4,
        t.services.hbot.p5,
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center space-y-4">
          <Badge className="bg-accent text-accent-foreground">{t.services.badge}</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{t.services.title}</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            {t.services.desc}
          </p>
        </header>

        <div className="flex flex-col gap-24">
          {serviceCategories.map((service, idx) => {
            const serviceImg = PlaceHolderImages.find(i => i.id === service.image);
            return (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col lg:flex-row gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-primary">{service.title}</h2>
                  </div>
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex gap-2 items-start text-sm text-foreground/70">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    {serviceImg && (
                      <Image
                        src={serviceImg.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover"
                        data-ai-hint={service.image.replace('-', ' ')}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
