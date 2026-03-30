
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Clock,
  Instagram,
  Facebook
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-accent" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">Inquiry Sent!</h1>
          <p className="text-foreground/60">
            Thank you for reaching out to Dhanwanthri Healing. Our clinical coordinators will contact you within 24 hours to confirm your appointment.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="border-primary text-primary">
            Send another inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <Badge className="bg-accent text-accent-foreground">Reach Out</Badge>
              <h1 className="text-4xl font-headline font-bold text-primary">Get in Touch</h1>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Whether you have questions about specific treatments or wish to book a consultation with Dr. Dharmesh, we are here to help.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">Location</h4>
                  <p className="text-foreground/60">Chennai, Tamil Nadu, India</p>
                  <p className="text-xs text-accent font-bold mt-1 hover:underline cursor-pointer">View on Map</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">Phone</h4>
                  <p className="text-foreground/60">+91 XXX XXX XXXX</p>
                  <p className="text-xs text-foreground/40 italic">24/7 Availability for inquiries</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary font-headline">Clinic Hours</h4>
                  <p className="text-foreground/60">7:00 AM — 9:00 PM</p>
                  <p className="text-foreground/40 text-sm">Monday through Sunday</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t">
              <p className="font-bold text-primary mb-4 font-headline">Social Links</p>
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
                  <CardTitle className="font-headline text-2xl">Book Appointment</CardTitle>
                </div>
                <CardDescription className="text-primary-foreground/70">
                  Fill out the form below to request a consultation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Full Name</label>
                      <Input placeholder="John Doe" required className="border-primary/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Phone Number</label>
                      <Input type="tel" placeholder="+91 XXXXX XXXXX" required className="border-primary/10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">Email Address</label>
                    <Input type="email" placeholder="john@example.com" required className="border-primary/10" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">Preferred Service</label>
                    <select className="flex h-10 w-full rounded-md border border-primary/10 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>General Consultation</option>
                      <option>Advanced Kinesiology</option>
                      <option>Dry Needling</option>
                      <option>Joint Manipulation</option>
                      <option>Ayurveda Panchakarma</option>
                      <option>HBOT (Hyperbaric Oxygen)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">Your Inquiry / Symptoms</label>
                    <Textarea 
                      placeholder="Please describe your condition or treatment you are interested in..." 
                      className="min-h-[120px] border-primary/10" 
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold py-6">
                    <Send className="mr-2 h-5 w-5" /> Submit Inquiry
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
