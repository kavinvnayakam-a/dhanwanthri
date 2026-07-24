"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { HeartPulse, Stethoscope, ClipboardCheck, Lock, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PatientPrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 space-y-4">
          <Badge className="bg-primary text-primary-foreground mb-4">Clinical Standards</Badge>
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-primary shadow-xl">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">{t.nav.patientPrivacy}</h1>
          <p className="text-foreground/60">Confidentiality and protection of medical records for Doctor Dharmesh's patients.</p>
        </header>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
            <div className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Stethoscope className="h-6 w-6 text-accent" /> 1. Medical Confidentiality
                </h2>
                <p className="text-foreground/70 leading-relaxed text-lg">
                  At Dhanwanthri Maruthuvam, we strictly adhere to doctor-patient confidentiality. All health data collected during assessments is considered highly sensitive. This includes your clinical history, Ayurvedic profiling, Kinesiology gait analysis, and specialized treatment records (HBOT/Panchakarma).
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <ClipboardCheck className="h-6 w-6 text-accent" /> 2. Clinical Data Flow
                </h2>
                <p className="text-foreground/70">Our clinical portal is designed to partition your data for your safety:</p>
                <div className="space-y-4">
                  {[
                    { title: "Receptionist Level", desc: "Access limited to basic contact info and enrollment status." },
                    { title: "Junior Doctor Level", desc: "Access to initial assessments and physical exam data." },
                    { title: "Senior Doctor Level", desc: "Full access to diagnostic history, prescriptions, and long-term recovery plans by Dr. Dharmesh." },
                    { title: "Billing Level", desc: "Access only to service categories and financial settlement data." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-primary/5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">{i+1}</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{step.title}</p>
                        <p className="text-xs text-foreground/60">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Lock className="h-6 w-6 text-accent" /> 3. Secure Storage
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  We utilize clinical-grade authentication and encryption provided by Firebase to host our Patient Directory. All access to clinical records is logged and monitored. We do not store medical records on public devices or local insecure drives.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-accent" /> 4. Your Rights
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  As a patient of Dr. Dharmesh, you have the right to request a digital copy of your clinical assessments, update your contact information, or request the closure of your clinical file. Please visit our front desk in Ashok Nagar or contact us via our official clinical email.
                </p>
              </section>

              <div className="p-8 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20">
                <p className="text-sm font-medium leading-relaxed italic">
                  "Protecting your physical health begins with protecting your clinical truth. Your diagnostic data is a sacred part of your healing journey, and we treat it with the utmost scientific and ethical integrity."
                </p>
                <p className="text-xs font-bold mt-4 uppercase tracking-widest opacity-70">— Dr. Dharmesh Kubendiran</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
