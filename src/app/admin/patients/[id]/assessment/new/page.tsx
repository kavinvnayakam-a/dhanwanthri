"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  ArrowLeft, 
  Activity, 
  Brain,
  History,
  Heart,
  UserPlus,
  Waves
} from 'lucide-react';
import Link from 'next/link';

export default function NewAssessmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    visitType: 'Out-patient',
    chiefComplaints: '',
    duration: '',
    associateComplaints: '',
    disorders: {
      digestive: [],
      hematological: [],
      muscular: [],
      skin: [],
      skeletal: [],
      nervous: []
    },
    personalHistory: {
      appetite: 'Good',
      bowel: 'Regular',
      micturition: 'Normal',
      sleep: 'Sound',
      pain: 'No',
      stress: 'Personal'
    },
    obgyn: {
      lmpr: '',
      cycle: '',
      flow: '',
      dysmenorrhoea: false,
      leucorrhoea: false,
      delivery: 'Normal'
    },
    pastHistory: {
      hypertension: false,
      diabetes: false,
      piles: false,
      thyroid: false,
      other: '',
      familyHistory: ''
    },
    lifestyle: {
      surgical: '',
      medical: '',
      diet: '',
      water: '',
      addictions: '',
      physicalActivity: 'No'
    },
    assessment: {
      height: '',
      weight: '',
      skin: '',
      bp: '',
      pulse: '',
      vision: '',
      physicalExam: '',
      labInvestigation: '',
      diagnosis: ''
    },
    ayurvedic: {
      dosha: 'Vata',
      dhatu: 'Rasa',
      chakra: 'Mooladhara',
      marma: '',
      kosha: 'Annamaya'
    },
    suggestedServices: '',
    doctorChief: 'Junior Doctor Name',
    status: 'waiting'
  });

  const handleCheckbox = (section: string, value: string) => {
    const current = formData.disorders[section] || [];
    const updated = current.includes(value) 
      ? current.filter((v: string) => v !== value) 
      : [...current, value];
    setFormData({
      ...formData,
      disorders: { ...formData.disorders, [section]: updated }
    });
  };

  const updateNestedState = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'patients', id as string, 'assessments'), formData);
      await updateDoc(doc(db, 'patients', id as string), {
        lastVisit: formData.date,
        type: formData.visitType,
        status: 'waiting'
      });
      router.push(`/admin/junior-doctor`);
    } catch (error) {
      console.error(error);
      alert('Error saving assessment');
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-primary border-b pb-2 mb-6 mt-8 flex items-center gap-2 uppercase tracking-wide">
      {children}
    </h3>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href={`/admin/patients/${id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Patient Profile</Link>
          </Button>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="bg-primary px-8 rounded-xl shadow-lg" disabled={loading}>
              {loading ? 'Submitting...' : <><UserPlus className="mr-2 h-4 w-4" /> Move to Waiting Room</>}
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <FileText className="h-8 w-8 text-accent" /> JUNIOR DOCTOR ASSESSMENT
            </CardTitle>
            <CardDescription className="text-primary-foreground/70">Scientific diagnostic data Entry - All tabs are persistent</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none bg-muted/50 p-0 h-auto flex-wrap border-b">
                {['general', 'disorders', 'history', 'clinical', 'ayurveda'].map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold uppercase text-xs tracking-widest">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="p-10 min-h-[600px]">
                <TabsContent value="general" className="mt-0 space-y-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase text-[10px]">Assessment Date</label>
                      <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase text-[10px]">Visit Category</label>
                      <select className="w-full h-12 border rounded-xl px-3 bg-white" value={formData.visitType} onChange={(e) => setFormData({...formData, visitType: e.target.value})}>
                        <option>Out-patient</option>
                        <option>In-patient</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase text-[10px]">Assessing Doctor</label>
                      <Input value={formData.doctorChief} onChange={(e) => setFormData({...formData, doctorChief: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  
                  <SectionTitle><Brain className="h-5 w-5" /> Patient Complaints</SectionTitle>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Chief Complaints *</label>
                      <textarea className="w-full min-h-[120px] border rounded-2xl p-4 text-sm" value={formData.chiefComplaints} onChange={(e) => setFormData({...formData, chiefComplaints: e.target.value})} placeholder="Describe primary symptoms in detail..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Symptom Duration</label>
                        <Input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2 weeks, 3 months" className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Associate Complaints</label>
                        <Input value={formData.associateComplaints} onChange={(e) => setFormData({...formData, associateComplaints: e.target.value})} placeholder="Other related issues..." className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="disorders" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                    {[
                      { id: 'digestive', label: 'Digestive (Rasa)', items: ['Indigestion', 'Acidity', 'Ulcer', 'IBS', 'Gastritis', 'GERD'] },
                      { id: 'hematological', label: 'Hematological (Raktha)', items: ['Anemia', 'Varicose vein', 'Triglyceride', 'Hypertension', 'Cholesterol'] },
                      { id: 'muscular', label: 'Muscular (Mamsa)', items: ['Obesity', 'Muscle pain', 'Weight Loss', 'Debility'] },
                      { id: 'skin', label: 'Skin (Medas)', items: ['Itching', 'Vitiligo', 'Psoriasis', 'Discolouration', 'Eczema'] },
                      { id: 'skeletal', label: 'Skeletal (Asthi)', items: ['Osteo Arthritis', 'Disc prolapse', 'Cervical Spondylosis', 'Rheumatoid arthritis', 'Lumbar Spondylosis', 'Sciatica'] },
                      { id: 'nervous', label: 'Nervous (Majja)', items: ["Parkinson's", "Alzheimer's", 'Paralysis', 'Immunity'] },
                    ].map((section) => (
                      <div key={section.id} className="space-y-4">
                        <h4 className="font-bold text-accent border-l-4 border-accent pl-2 uppercase text-xs tracking-widest">{section.label}</h4>
                        <div className="space-y-2 bg-muted/30 p-4 rounded-2xl">
                          {section.items.map((d) => (
                            <div key={d} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`${section.id}-${d}`} 
                                checked={formData.disorders[section.id]?.includes(d)}
                                onCheckedChange={() => handleCheckbox(section.id, d)} 
                              />
                              <label htmlFor={`${section.id}-${d}`} className="text-sm font-medium">{d}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-12">
                  <div>
                    <SectionTitle><History className="h-5 w-5" /> Detailed Histories</SectionTitle>
                    <div className="grid md:grid-cols-3 gap-6">
                      {['appetite', 'bowel', 'micturition', 'sleep', 'pain', 'stress'].map(f => (
                        <div key={f} className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-foreground/40">{f}</label>
                          <Input 
                            value={formData.personalHistory[f]} 
                            onChange={(e) => updateNestedState('personalHistory', f, e.target.value)} 
                            className="h-11 rounded-xl"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-pink-50/30 p-8 rounded-[2.5rem] border border-pink-100/50">
                    <h4 className="text-sm font-bold text-pink-600 mb-6 uppercase tracking-widest">OB / GYN History</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2"><label className="text-xs font-bold">LMPR</label><Input value={formData.obgyn.lmpr} onChange={(e) => updateNestedState('obgyn', 'lmpr', e.target.value)} className="rounded-xl border-pink-200" /></div>
                      <div className="space-y-2"><label className="text-xs font-bold">Cycle</label><Input value={formData.obgyn.cycle} onChange={(e) => updateNestedState('obgyn', 'cycle', e.target.value)} className="rounded-xl border-pink-200" /></div>
                      <div className="space-y-2"><label className="text-xs font-bold">Flow</label><Input value={formData.obgyn.flow} onChange={(e) => updateNestedState('obgyn', 'flow', e.target.value)} className="rounded-xl border-pink-200" /></div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="mt-0 space-y-8">
                  <SectionTitle><Heart className="h-5 w-5" /> Physical & Lab Investigation</SectionTitle>
                  <div className="grid md:grid-cols-3 gap-6">
                    {['height', 'weight', 'bp', 'pulse', 'vision', 'skin'].map(f => (
                      <div key={f} className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-foreground/40">{f}</label>
                        <Input value={formData.assessment[f]} onChange={(e) => updateNestedState('assessment', f, e.target.value)} className="h-11 rounded-xl" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Suggested Clinical Services (For Senior Review)</label>
                      <textarea className="w-full border rounded-2xl p-4 text-sm bg-accent/5 border-accent/20" value={formData.suggestedServices} onChange={(e) => setFormData({...formData, suggestedServices: e.target.value})} placeholder="e.g. 5 days Panchakarma, 3 Sessions HBOT..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Physical Examination Details</label>
                      <textarea className="w-full border rounded-2xl p-4 text-sm" value={formData.assessment.physicalExam} onChange={(e) => updateNestedState('assessment', 'physicalExam', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Provisional Diagnosis</label>
                      <textarea className="w-full border border-primary/20 rounded-2xl p-4 text-sm font-bold text-primary" value={formData.assessment.diagnosis} onChange={(e) => updateNestedState('assessment', 'diagnosis', e.target.value)} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ayurveda" className="mt-0 space-y-8">
                  <SectionTitle><Waves className="h-5 w-5" /> Ayurvedic Profiling</SectionTitle>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      { id: 'dosha', items: ['Vata', 'Pitha', 'Kapha', 'Vatapitha', 'Vatakapha', 'Pithakapha', 'Vatapithakapha'] },
                      { id: 'dhatu', items: ['Rasa', 'Raktha', 'Mamsa', 'Medas', 'Asthi', 'Majja', 'Shukra'] },
                      { id: 'chakra', items: ['Mooladhara', 'Swadhisthana', 'Manipura', 'Anahatar', 'Vishuddhi', 'Ajna', 'Sahasrara'] },
                      { id: 'kosha', items: ['Annamaya', 'Pranamaya', 'Manomaya', 'Vigyanamaya', 'Anandamaya'] },
                    ].map(group => (
                      <div key={group.id} className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-foreground/40">{group.id}</label>
                        <select className="w-full h-12 rounded-xl border border-primary/10 px-4 bg-white" value={formData.ayurvedic[group.id]} onChange={(e) => updateNestedState('ayurvedic', group.id, e.target.value)}>
                          {group.items.map(v => <option key={v}>{v}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-bold">Marma / Varma Points Targeted</label>
                    <Input value={formData.ayurvedic.marma} onChange={(e) => updateNestedState('ayurvedic', 'marma', e.target.value)} placeholder="Identify specific therapeutic points..." className="h-12 rounded-xl" />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
