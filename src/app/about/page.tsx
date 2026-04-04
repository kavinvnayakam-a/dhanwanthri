"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, BookOpen, Microscope } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  const profileImageUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Images%2FMobile%20hero%202.webp?alt=media&token=5a4225cb-da49-4d62-970b-4e83c72c0f20";
  
  const qualifications = [
    { icon: GraduationCap, label: "Degree", value: "BAMS (Ayurveda)" },
    { icon: Award, label: "Doctorate", value: "PhD in Sports Training" },
    { icon: Microscope, label: "Specialization", value: "Biomechanist" },
    { icon: BookOpen, label: "Expertise", value: "Sports Kinesiology" },
  ];

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Optimized for visibility on all devices */}
        <div className="mb-10 md:mb-16 space-y-4 text-center lg:text-left">
          <Badge className="bg-primary text-primary-foreground mb-2">{t.about.badge}</Badge>
          <h1 className="text-3xl md:text-6xl font-headline font-bold text-primary leading-tight">
            {t.about.name}
          </h1>
          <p className="text-lg md:text-2xl text-accent font-bold">{t.about.title}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          <div className="space-y-8">
            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mx-auto lg:mx-0 max-w-sm md:max-w-full">
              <Image
                src={profileImageUrl}
                alt={t.about.name}
                fill
                className="object-cover"
                data-ai-hint="doctor portrait"
                priority
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {qualifications.map((q, idx) => (
                <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 md:p-4 flex flex-col items-center text-center gap-2">
                    <q.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    <div className="space-y-1">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-foreground/40 font-bold">{q.label}</p>
                      <p className="text-xs md:text-sm font-bold text-primary leading-tight">{q.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div className="prose prose-lg text-foreground/70 space-y-6 md:space-y-8">
              <div className="space-y-4">
                <p className="leading-relaxed text-base md:text-lg">
                  {t.about.bio1}
                </p>
                <p className="leading-relaxed text-base md:text-lg">
                  {t.about.bio2}
                </p>
              </div>
              
              <div className="pt-4 md:pt-6">
                <h3 className="text-xl md:text-2xl font-headline font-bold text-primary mb-4 border-l-4 border-accent pl-4">{t.about.philosophy}</h3>
                <p className="italic bg-accent/5 p-5 md:p-6 rounded-2xl text-primary font-medium text-base md:text-lg leading-relaxed shadow-inner">
                  {t.about.quote}
                </p>
              </div>

              <div className="bg-white p-6 md:p-10 rounded-3xl border border-primary/10 shadow-sm space-y-6 md:space-y-8">
                <h4 className="font-headline font-bold text-primary text-xl md:text-2xl">{t.about.expertiseTitle}</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm md:text-base font-medium">
                  {[t.about.exp1, t.about.exp2, t.about.exp3, t.about.exp4, t.about.exp5, t.about.exp6].map((exp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" /> 
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
