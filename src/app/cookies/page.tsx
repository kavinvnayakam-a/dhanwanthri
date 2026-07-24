"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Cookie, Settings, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CookiePolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto text-accent">
            <Cookie className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">{t.nav.cookies}</h1>
          <p className="text-foreground/60">Transparency regarding your clinical browsing session</p>
        </header>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Settings className="h-6 w-6 text-accent" /> Essential Cookies
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Dhanwanthri Maruthuvam uses "Essential Cookies" to ensure the basic functionality of our website and clinical portal. These cookies are required for:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {[
                    "Remembering your language preference (English/Tamil)",
                    "Maintaining secure staff login sessions",
                    "Security validation for booking requests",
                    "Optimizing load times for medical imagery"
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-foreground/70">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-accent" /> Third-Party Analytics
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  We use minimal third-party scripts (such as Google Maps and Firebase) which may use cookies to provide geolocation services and ensure the stability of our clinical database. We do not use advertising or tracking cookies that monitor your activity outside of our official domain.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-accent" /> Managing Cookies
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Most web browsers allow you to control cookies through their settings. However, disabling essential cookies may prevent you from using certain features, such as switching languages or accessing the staff clinical portals.
                </p>
              </section>

              <div className="p-6 bg-muted rounded-2xl text-xs text-foreground/40 italic">
                By continuing to use this website, you agree to our use of essential cookies as described above to provide a professional medical browsing experience.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
