
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
      color: 'bg-blue-500/10 text-blue-600',
      link: '/services#kinesiology'
    },
    {
      title: 'Dry Needling',
      desc: 'Modern clinical treatment for muscular pain and trigger points.',
      icon: Zap,
      color: 'bg-yellow-500/10 text-yellow-600',
      link: '/services#needling'
    },
    {
      title: 'Joint Manipulation',
      desc: 'HVLA thrust techniques to restore full range of motion.',
      icon: Stethoscope,
      color: 'bg-green-500/10 text-green-600',
      link: '/services#manipulation'
    },
    {
      title: 'Sports Therapy',
      desc: 'Comprehensive rehab for athletes to reach peak efficiency.',
      icon: UserCheck,
      color: 'bg-purple-500/10 text-purple-600',
      link: '/services#sports'
    }
  ];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          {heroImg && (
            <Image
              src={heroImg.imageUrl}
              alt={heroImg.description}
              fill
              className="object-cover opacity-20"
              priority
              data-ai-hint={heroImg.imageHint}
            />
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge variant="outline" className="border-primary text-primary px-4 py-1">
              Chennai's Premier Integrative Clinic
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight text-primary">
              Ancient Wisdom <br />
              <span className="text-accent italic">Modern Recovery.</span>
            </h1>
            <p className="text-xl text-foreground/80 font-body max-w-lg leading-relaxed">
              Dhanwanthri Healing integrates traditional Ayurveda with Advanced Sports Therapy, Chiropractic, and Osteopathic Manipulation for holistic pain management.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 text-lg">
                <Link href="/contact">Book Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 px-8 text-lg">
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
            A premium Ayurvedic and Sports Therapy clinic located in Chennai, it's the first of its kind in Tamilnadu. We specialize in traditional Ayush medicine paired with advanced techniques like Dry Needling, Kinesiology Taping, and Osteopathic Manipulation.
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
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold text-primary">Specialized Treatments</h2>
            <p className="text-foreground/60 text-lg">
              Combining evidence-based sports science with holistic rejuvenation for lasting relief.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
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
                    className="flex items-center text-accent font-bold text-sm group-hover:gap-2 transition-all"
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
        <div className="bg-accent/10 rounded-3xl p-12 text-center border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-accent" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-6">Exciting Upgrades!</h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            We are expanding from a 5-room facility to 12 exclusive therapy rooms, featuring specialized spaces for Panchakarma, HBOT (Hyperbaric Oxygen Chamber), and Hydrocolon therapy.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/gallery">Tour Facilities</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
