
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Maximize2, Camera } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();

  const galleryItems = [
    { id: 'interior-lobby', title: t.gallery.item1, category: t.gallery.cat1 },
    { id: 'ayurveda-therapy', title: t.gallery.item2, category: t.gallery.cat2 },
    { id: 'hbot-chamber', title: t.gallery.item3, category: t.gallery.cat3 },
    { id: 'hydrocolon-room', title: t.gallery.item4, category: t.gallery.cat4 },
    { id: 'dry-needling', title: t.gallery.item5, category: t.gallery.cat2 },
    { id: 'treatment-room', title: t.gallery.item6, category: t.gallery.cat1 },
    { id: 'sports-rehab', title: t.gallery.item7, category: t.gallery.cat3 },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-4">
          <Badge className="bg-primary text-primary-foreground">{t.gallery.badge}</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{t.gallery.title}</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            {t.gallery.desc}
          </p>
        </header>

        {/* Video Feature Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-headline font-bold text-primary mb-8 flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-accent" /> {t.gallery.videoTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden bg-black border-none rounded-3xl shadow-xl group cursor-pointer relative aspect-video">
              <Image 
                src="https://picsum.photos/seed/vid1/800/450" 
                alt="Sports Therapy Intro" 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <PlayCircle className="h-20 w-20 text-accent drop-shadow-lg" />
                <h3 className="text-xl font-bold font-headline">{t.gallery.v1Title}</h3>
                <p className="text-sm text-white/70">{t.gallery.v1Sub}</p>
              </div>
            </Card>
            <Card className="overflow-hidden bg-black border-none rounded-3xl shadow-xl group cursor-pointer relative aspect-video">
              <Image 
                src="https://picsum.photos/seed/vid2/800/450" 
                alt="Ayurveda Tour" 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <PlayCircle className="h-20 w-20 text-accent drop-shadow-lg" />
                <h3 className="text-xl font-bold font-headline">{t.gallery.v2Title}</h3>
                <p className="text-sm text-white/70">{t.gallery.v2Sub}</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section>
          <h2 className="text-2xl font-headline font-bold text-primary mb-8 flex items-center gap-2">
            <Camera className="h-6 w-6 text-accent" /> {t.gallery.facilityTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => {
              const img = PlaceHolderImages.find(i => i.id === item.id);
              return (
                <div key={item.id} className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
                  {img && (
                    <Image
                      src={img.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={img.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
                    <Badge className="bg-accent text-accent-foreground w-fit mb-2">{item.category}</Badge>
                    <h3 className="text-white text-xl font-bold font-headline">{item.title}</h3>
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                      <Maximize2 className="h-4 w-4" /> {t.gallery.viewFull}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
