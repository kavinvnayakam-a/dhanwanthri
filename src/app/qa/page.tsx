
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Send, Loader2, Info } from 'lucide-react';
import { aiPoweredQnA } from '@/ai/flows/ai-powered-q-n-a-flow';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

const CLINIC_KNOWLEDGE_BASE = `
DHANWANTHRI MARUTHUVAM is a premium Ayurvedic and Sports Therapy clinic in Chennai.
Physician: Dr. Dharmesh Kubendiran (BAMS, PhD in Sports Method and Training).
Services: Advanced Kinesiology, Dry Needling, Manipulation (Spinal, Peripheral, Osteopathic), Sports Therapy, Panchakarma, HBOT (Hyperbaric Oxygen Chamber 2ATA), Hydrocolon therapy.
Specialties: Pain Management, Sports Recovery, General Wellness.
Kinesiology: Corrects muscle imbalances, Neuromuscular re-education, GAIT analysis.
Dry Needling: Targets trigger points, rapid pain relief, neurological reset.
Manipulation: HVLA thrust techniques for joint range of motion.
HBOT: 2ATA Hyperbaric oxygen chamber.
Operating Hours: 7 AM to 9 PM, Monday to Sunday.
Clinic Upgrade: Now has 12 specialized treatment rooms.
`;

export default function QAPage() {
  const { t, language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(null);

    try {
      const response = await aiPoweredQnA({
        question,
        websiteContent: CLINIC_KNOWLEDGE_BASE
      });
      setAnswer(response.answer);
    } catch (error) {
      console.error(error);
      setAnswer(t.qa.error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    t.qa.q1,
    t.qa.q2,
    t.qa.q3,
    t.qa.q4,
    t.qa.q5
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 space-y-4">
          <Badge className="bg-accent text-accent-foreground mb-2">{t.qa.badge}</Badge>
          <h1 className="text-4xl font-headline font-bold text-primary">{t.qa.title}</h1>
          <p className="text-lg text-foreground/60">
            {t.qa.desc}
          </p>
        </header>

        <Card className="shadow-xl border-none overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-accent" />
              <CardTitle className="font-headline">{t.qa.cardTitle}</CardTitle>
            </div>
            <CardDescription className="text-primary-foreground/70">
              {t.qa.cardDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                placeholder={t.qa.placeholder}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow h-12 text-lg border-primary/20"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>

            <div className="space-y-4">
              <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{t.qa.suggested}</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(q)}
                    className="text-sm bg-background border border-primary/10 hover:border-accent hover:text-accent px-4 py-2 rounded-full transition-all text-foreground/60"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {answer && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-accent/5 p-6 rounded-2xl border border-accent/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div className="space-y-2">
                    <p className="font-bold text-primary">{t.qa.insight}</p>
                    <p className="text-lg leading-relaxed text-foreground/80">{answer}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
