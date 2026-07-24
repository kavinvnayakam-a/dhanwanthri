"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Accessibility, UserCircle, Layout, Headphones } from 'lucide-react';

export default function AccessibilityPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <Accessibility className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">{t.nav.accessibility}</h1>
          <p className="text-foreground/60">Inclusive care for all patients, both in-person and online.</p>
        </header>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <UserCircle className="h-6 w-6 text-accent" /> Our Commitment
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Dhanwanthri Maruthuvam is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to our website.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-3">
                    <Layout className="h-5 w-5 text-accent" /> Visual Design
                  </h3>
                  <p className="text-sm text-foreground/70">
                    We use high-contrast text and clinical teal accents to ensure readability. Our font sizes are optimized for various devices, and we avoid complex animations that may cause discomfort.
                  </p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-3">
                    <Headphones className="h-5 w-5 text-accent" /> Screen Readers
                  </h3>
                  <p className="text-sm text-foreground/70">
                    All images on our site, especially our clinical gallery, include descriptive alternate text to ensure patients using screen readers can navigate our facility visuals effectively.
                  </p>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary">Conformance Status</h2>
                <p className="text-foreground/70 leading-relaxed">
                  The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. Dhanwanthri Maruthuvam aims to maintain WCAG 2.1 Level AA conformance.
                </p>
              </section>

              <section className="bg-muted p-8 rounded-3xl">
                <h3 className="text-lg font-headline font-bold text-primary mb-2">Assistance</h3>
                <p className="text-sm text-foreground/60">
                  If you encounter any accessibility barriers on our website, please let us know. We welcome your feedback at <span className="font-bold">admin@dhanwanthrimaruthuvam.com</span>. We will respond within 2-3 business days.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
