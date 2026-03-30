
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, BookOpen, Microscope } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const drImg = PlaceHolderImages.find(img => img.id === 'dr-dharmesh');
  
  const qualifications = [
    { icon: GraduationCap, label: "Degree", value: "BAMS (Ayurveda)" },
    { icon: Award, label: "Doctorate", value: "PhD in Sports Method and Training" },
    { icon: Microscope, label: "Specialization", value: "Sports Scientist & Biomechanist" },
    { icon: BookOpen, label: "Expertise", value: "Sports Kinesiology" },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Profile Image & Quick Info */}
          <div className="space-y-8 sticky top-24">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              {drImg && (
                <Image
                  src={drImg.imageUrl}
                  alt={drImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint="doctor portrait"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {qualifications.map((q, idx) => (
                <Card key={idx} className="bg-white border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <q.icon className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold">{q.label}</p>
                      <p className="text-sm font-bold text-primary">{q.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Biography & Philosophy */}
          <div className="space-y-8 pt-8">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground">Primary Physician</Badge>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Dr. Dharmesh Kubendiran</h1>
              <p className="text-xl text-accent font-bold">Leading Expert in Integrative Sports Medicine</p>
            </div>

            <div className="prose prose-lg text-foreground/70 space-y-6">
              <p>
                Dr. Dharmesh Kubendiran is a visionary in the field of Ayush medicine, bridging the gap between ancient Ayurvedic healing and modern sports science. With a BAMS degree and a PhD in Sports Method and Training, he brings a unique scientific perspective to traditional therapies.
              </p>
              <p>
                As a dedicated Sports Scientist and Biomechanist, Dr. Dharmesh focuses on analyzing gait patterns, muscle mechanics, and neurological communication to resolve chronic pain at its source.
              </p>
              
              <h3 className="text-2xl font-headline font-bold text-primary pt-4">Professional Philosophy</h3>
              <p>
                "Our approach isn't just about suppressing symptoms; it's about optimizing the human machine. By integrating Kinesiology with Siddha and Ayurveda, we reset the body's natural healing systems and restore peak functional performance."
              </p>

              <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-4">
                <h4 className="font-headline font-bold text-primary">Key Expertise:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Spinal Disorders & Arthritis</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Neuromusculoskeletal Pain</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Gait Pattern Correction</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Advanced Sports Rehabilitation</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Myofascial Trigger Therapy</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Metabolic Recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
