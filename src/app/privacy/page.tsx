"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, FileText, Lock, Eye } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">{t.nav.privacy}</h1>
          <p className="text-foreground/60">Last updated: April 2026</p>
        </header>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <FileText className="h-6 w-6 text-accent" /> 1. Information Collection
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Dhanwanthri Maruthuvam ("we," "our," or "the clinic") collects information that you provide directly to us through our website contact forms, WhatsApp booking links, and during physical enrollment at our clinic. This information may include your name, phone number, email address, and general inquiry details.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Eye className="h-6 w-6 text-accent" /> 2. How We Use Your Data
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  We use the information collected primarily to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                  <li>Schedule and confirm your medical consultations with Doctor Dharmesh.</li>
                  <li>Provide you with information regarding our integrative sports therapy and Ayurvedic services.</li>
                  <li>Improve our clinical services and patient experience.</li>
                  <li>Comply with local health regulations and record-keeping requirements in Tamilnadu.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Lock className="h-6 w-6 text-accent" /> 3. Data Protection
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Your privacy is our priority. We implement professional security measures to maintain the safety of your personal information. Clinical data is stored within a secure, authenticated Firebase environment, accessible only by Dr. Dharmesh and his authorized clinical staff.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent" /> 4. Disclosure to Third Parties
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted clinical partners who assist us in operating our clinic and serving our patients, so long as those parties agree to keep this information confidential.
                </p>
              </section>

              <section className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mt-12">
                <h3 className="text-xl font-headline font-bold text-primary mb-2">Contact for Privacy Concerns</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  If you have any questions regarding this privacy policy or how Doctor Dharmesh handles your data, please contact us at: <br />
                  <span className="font-bold">admin@dhanwanthrimaruthuvam.com</span>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
