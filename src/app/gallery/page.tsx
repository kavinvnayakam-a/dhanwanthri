
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Maximize2, Camera } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GalleryPage() {
  const galleryItems = [
    { id: 'interior-lobby', title: 'Clinic Reception', category: 'Interior' },
    { id: 'ayurveda-therapy', title: 'Traditional Therapy Room', category: 'Treatment' },
    { id: 'hbot-chamber', title: 'Advanced HBOT 2ATA', category: 'Equipment' },
    { id: 'hydrocolon-room', title: 'Hydrocolon Therapy', category: 'Specialized' },
    { id: 'dry-needling', title: 'Clinical Procedure', category: 'Demonstration' },
    { id: 'treatment-room', title: 'Private Recovery Suite', category: 'Interior' },
    { id: 'sports-rehab', title: 'Functional Rehab Area', category: 'Equipment' },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-4">
          <Badge className="bg-primary text-primary-foreground">Visual Tour</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Clinic & Procedures</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Experience the sophisticated environment and precision-driven treatments at Dhanwanthri Healing.
          </p>
        </header>

        {/* Video Feature Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-headline font-bold text-primary mb-8 flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-accent" /> Video Demonstrations
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
                <h3 className="text-xl font-bold font-headline">Advanced Kinesiology Overview</h3>
                <p className="text-sm text-white/70">5:20 • Clinical Tutorial</p>
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
                <h3 className="text-xl font-bold font-headline">Clinic Facility Walkthrough</h3>
                <p className="text-sm text-white/70">3:45 • Facility Tour</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section>
          <h2 className="text-2xl font-headline font-bold text-primary mb-8 flex items-center gap-2">
            <Camera className="h-6 w-6 text-accent" /> Facility Gallery
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
                      <Maximize2 className="h-4 w-4" /> View Fullscreen
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
