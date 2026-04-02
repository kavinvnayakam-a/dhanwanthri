import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, BookOpen, Microscope } from 'lucide-react';

export default function AboutPage() {
  const profileImageUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Images%2FMobile%20hero%202.webp?alt=media&token=5a4225cb-da49-4d62-970b-4e83c72c0f20";
  
  const qualifications = [
    { icon: GraduationCap, label: "Degree", value: "BAMS (Ayurveda)" },
    { icon: Award, label: "Doctorate", value: "PhD in Sports Method and Training" },
    { icon: Microscope, label: "Specialization", value: "Sports Scientist & Biomechanist" },
    { icon: BookOpen, label: "Expertise", value: "Sports Kinesiology" },
  ];

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header - Visible only on small screens */}
        <div className="lg:hidden mb-8 space-y-4">
          <Badge className="bg-primary text-primary-foreground">Primary Physician</Badge>
          <h1 className="text-3xl font-headline font-bold text-primary leading-tight">Dr. Dharmesh Kubendiran</h1>
          <p className="text-lg text-accent font-bold">Leading Expert in Integrative Sports Medicine</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Profile Image & Quick Info */}
          <div className="space-y-6 md:space-y-8 lg:sticky lg:top-24">
            <div className="relative aspect-[3/4] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={profileImageUrl}
                alt="Dr. Dharmesh Kubendiran"
                fill
                className="object-cover"
                data-ai-hint="doctor portrait"
                priority
              />
            </div>
            
            {/* Qualifications Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {qualifications.map((q, idx) => (
                <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 md:p-4 flex flex-col items-center text-center gap-1 md:gap-2">
                    <q.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-foreground/40 font-bold">{q.label}</p>
                      <p className="text-xs md:text-sm font-bold text-primary leading-tight">{q.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Biography & Philosophy */}
          <div className="space-y-8">
            {/* Desktop Header - Hidden on small screens */}
            <div className="hidden lg:block space-y-4">
              <Badge className="bg-primary text-primary-foreground">Primary Physician</Badge>
              <h1 className="text-5xl font-headline font-bold text-primary">Dr. Dharmesh Kubendiran</h1>
              <p className="text-xl text-accent font-bold">Leading Expert in Integrative Sports Medicine</p>
            </div>

            <div className="prose prose-lg text-foreground/70 space-y-6">
              <p className="leading-relaxed">
                Dr. Dharmesh Kubendiran is a visionary in the field of Ayush medicine, bridging the gap between ancient Ayurvedic healing and modern sports science. With a BAMS degree and a PhD in Sports Method and Training, he brings a unique scientific perspective to traditional therapies.
              </p>
              <p className="leading-relaxed">
                As a dedicated Sports Scientist and Biomechanist, Dr. Dharmesh focuses on analyzing gait patterns, muscle mechanics, and neurological communication to resolve chronic pain at its source.
              </p>
              
              <h3 className="text-2xl font-headline font-bold text-primary pt-4 border-l-4 border-accent pl-4">Professional Philosophy</h3>
              <p className="italic bg-accent/5 p-4 rounded-xl text-primary font-medium">
                "Our approach isn't just about suppressing symptoms; it's about optimizing the human machine. By integrating Kinesiology with Siddha and Ayurveda, we reset the body's natural healing systems and restore peak functional performance."
              </p>

              <div className="bg-white p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
                <h4 className="font-headline font-bold text-primary text-xl">Key Expertise:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Spinal Disorders & Arthritis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Neuromusculoskeletal Pain</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Gait Pattern Correction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Advanced Sports Rehabilitation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Myofascial Trigger Therapy</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" /> 
                    <span>Metabolic Recovery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
