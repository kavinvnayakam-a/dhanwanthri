
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

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-clinic');
  const interiorImg = PlaceHolderImages.find(i => i.id === 'interior-lobby');
  
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
      <section className="relative w-full h-[85vh] min-h-[700px] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          {heroImg && (
            <Image
              src={heroImg.imageUrl}
              alt={heroImg.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImg.imageHint}
            />
          )}
          {/* Subtle overlay for text legibility - adjusted for "clean" look */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
            <Badge variant="outline" className="border-primary text-primary px-4 py-1 bg-white/50 backdrop-blur-sm">
              Chennai's Premier Integrative Clinic
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold font-headline leading-[1.1] text-primary">
                Ancient Wisdom <br />
                <span className="text-accent italic opacity-90">Modern Recovery.</span>
              </h1>
              <p className="text-xl text-foreground/80 font-body max-w-lg leading-relaxed">
                Dhanwanthri Healing integrates traditional Ayurveda with Advanced Sports Therapy and Osteopathic Manipulation for holistic pain management.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 text-lg h-14 rounded-full shadow-lg shadow-primary/20">
                <Link href="/contact">Book Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 px-8 text-lg h-14 rounded-full backdrop-blur-sm bg-white/10">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-bold text-primary">Dhanwanthari Maruthuvam</h2>
          <p className="text-lg leading-relaxed text-foreground/70">
            A premium Ayurvedic and Sports Therapy clinic located in Chennai, it's the first of its kind in Tamilnadu. We specialize in traditional Ayush medicine paired with advanced techniques like Dry Needling and Osteopathic Manipulation.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/10">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <Clock className="h-4 w-4" /> Hours
              </h4>
              <p className="text-sm text-foreground/60">7 AM - 9 PM, Daily</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/10">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Capacity
              </h4>
              <p className="text-sm text-foreground/60">12 Specialized Therapy Rooms</p>
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
            <h2 className="text-4xl font-headline font-bold text-primary">Specialized Treatments</h2>
            <p className="text-foreground/60 text-lg">
              Combining evidence-based sports science with holistic rejuvenation for lasting relief.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-headline font-bold">{service.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
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
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-6">Exciting Upgrades!</h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            We are expanding from a 5-room facility to 12 exclusive therapy rooms, featuring specialized spaces for Panchakarma, HBOT, and Hydrocolon therapy.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
              <Link href="/gallery">Tour Facilities</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
