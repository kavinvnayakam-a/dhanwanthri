
"use client";

import { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Phone, 
  MapPin, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Clock,
  Instagram,
  Facebook,
  MessageSquare,
  Loader2,
  Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function ContactPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: t.services.kinesiology.title,
    message: ''
  });

  const whatsappNumber = "918608174673";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t.contact.whatsappMsg)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'appointments'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to send appointment request. Please try WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Dhanwanthri Maruthuvam",
    "description": "Book an appointment or inquire about our Ayurvedic and Sports Therapy treatments in Chennai.",
    "mainEntity": {
      "@type": "MedicalClinic",
      "name": "Dhanwanthri Maruthuvam",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.2, 54th street lane, 11th avenue, Ashok Nagar",
        "addressLocality": "Chennai",
        "postalCode": "600083",
        "addressCountry": "IN"
      },
      "telephone": "+918608174673",
      "openingHours": "Mo-Su 07:00-21:00"
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-accent" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">{t.contact.successTitle}</h1>
          <p className="text-foreground/60">
            {t.contact.successDesc}
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="border-primary text-primary">
            {t.contact.successBtn}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <Badge className="bg-accent text-accent-foreground">{t.contact.badge}</Badge>
              <h1 className="text-4xl font-headline font-bold text-primary">{t.contact.title}</h1>
              <p className="text-lg text-foreground/60 leading-relaxed">
                {t.contact.desc}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">{t.contact.loc}</h4>
                  <p className="text-foreground/60">{t.contact.locVal}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">{t.contact.phone}</h4>
                  <p className="text-foreground/60">{t.contact.phoneVal}</p>
                  <p className="text-xs text-foreground/40 italic">{t.contact.phoneSub}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">{t.contact.email}</h4>
                  <p className="text-foreground/60">{t.contact.emailVal}</p>
                  <p className="text-xs text-foreground/40 italic">{t.contact.emailSub}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">{t.contact.hours}</h4>
                  <p className="text-foreground/60">{t.contact.hoursVal}</p>
                  <p className="text-foreground/40 text-sm">{t.contact.hoursSub}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-2xl shadow-lg">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <MessageSquare className="h-6 w-6" />
                    Book via WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <div className="pt-8 border-t">
              <p className="font-bold text-primary mb-4 font-headline">{t.contact.social}</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:text-accent"><Instagram className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:text-accent"><Facebook className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-primary p-8 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-accent" />
                  <CardTitle className="font-headline text-2xl">{t.contact.formTitle}</CardTitle>
                </div>
                <CardDescription className="text-primary-foreground/70">
                  {t.contact.formDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">{t.contact.name}</label>
                      <Input 
                        placeholder="Full Name" 
                        required 
                        className="border-primary/10" 
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">{t.contact.phoneLabel}</label>
                      <Input 
                        type="tel" 
                        placeholder="+91 XXXXX XXXXX" 
                        required 
                        className="border-primary/10" 
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t.contact.emailLabel}</label>
                    <Input 
                      type="email" 
                      placeholder="email@example.com" 
                      required 
                      className="border-primary/10" 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t.contact.service}</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-sm"
                      value={form.service}
                      onChange={(e) => setForm({...form, service: e.target.value})}
                    >
                      <option>{t.services.kinesiology.title}</option>
                      <option>{t.services.needling.title}</option>
                      <option>{t.services.manipulation.title}</option>
                      <option>{t.services.hbot.title}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t.contact.message}</label>
                    <Textarea 
                      placeholder="Please describe your condition..." 
                      className="min-h-[120px] border-primary/10" 
                      required
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold py-6" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" /> {t.contact.submit}
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
