
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
  Dna, 
  Wind, 
  Activity, 
  Syringe, 
  Move, 
  CheckCircle2 
} from 'lucide-react';

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: 'kinesiology',
      title: 'Advanced Kinesiology',
      description: 'The scientific study of human body movement. It integrates human anatomy, physiology, and biomechanics to understand function and health.',
      image: 'ayurveda-therapy',
      icon: Move,
      points: [
        'Correcting Muscle Imbalances (Activating dormant muscles)',
        'Neuromuscular Re-education (Resetting neural pathways)',
        'Biomechanical Optimization (Gait and posture analysis)',
        'Lymphatic and Vascular Support (Reducing inflammation)',
        'Integration of Holistic Factors (Addressing systemic tension)'
      ]
    },
    {
      id: 'needling',
      title: 'Dry Needling',
      description: 'A modern clinical treatment based on neurobiology. Using thin filiform needles to target myofascial trigger points ("muscle knots").',
      image: 'dry-needling',
      icon: Syringe,
      points: [
        'Rapid Pain Relief by deactivating muscular pain sources',
        'Improved Range of Motion by releasing tight muscle bands',
        'Accelerated Healing through localized micro-trauma response',
        'Neurological Reset to interrupt the pain-spasm cycle',
        'Recovery for Athletes (Post-training recovery & DOMS reduction)'
      ]
    },
    {
      id: 'manipulation',
      title: 'Therapeutic Manipulation',
      description: 'Controlled HVLA (High-Velocity, Low-Amplitude) thrust techniques applied to joints to restore range of motion and neurological health.',
      image: 'treatment-room',
      icon: Activity,
      points: [
        'Spinal Manipulation (Cervical, Thoracic, Lumbar)',
        'Peripheral Joint Manipulation (Shoulders, Hips, Knees)',
        'Osteopathic Manual Manipulation (OMM)',
        'Muscle Energy Technique (MET)',
        'Instrument-Assisted Manipulation (Activator methods)'
      ]
    },
    {
      id: 'hbot',
      title: 'Specialized Care',
      description: 'Upgraded facilities for advanced holistic and recovery treatments including 2ATA Hyperbaric oxygen chambers.',
      image: 'hbot-chamber',
      icon: Wind,
      points: [
        'HBOT (Hyperbaric Oxygen Therapy) 2ATA Chamber',
        'Hydrocolon Therapy for detoxification',
        'Traditional Panchakarma Detoxification',
        'Sports Rehabilitation and Biomechanical Training',
        'Pain Management for Spinal Disorders & Arthritis'
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center space-y-4">
          <Badge className="bg-accent text-accent-foreground">Our Expertise</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Advanced Therapeutic Services</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Combining traditional Ayush medicine with modern sports science for precise, personalized care.
          </p>
        </header>

        <div className="flex flex-col gap-24">
          {serviceCategories.map((service, idx) => (
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
                  <Image
                    src={PlaceHolderImages.find(i => i.id === service.image)?.imageUrl || ''}
                    alt={service.title}
                    fill
                    className="object-cover"
                    data-ai-hint={service.image.replace('-', ' ')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
