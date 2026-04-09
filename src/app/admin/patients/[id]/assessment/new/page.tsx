
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Activity, 
  Stethoscope, 
  Waves,
  Brain,
  History,
  Heart
} from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function NewAssessmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    doctorChief: 'Dr. Dharmesh Kubendiran',
    doctorAssociate: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'patients', id as string, 'assessments'), formData);
      // Update patient's last visit and type
      await updateDoc(doc(db, 'patients', id as string), {
        lastVisit: formData.date,
        type: formData.visitType
      });
      router.push(`/admin/patients/${id}`);
    } catch (error) {
      console.error(error);
      alert('Error saving assessment');
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-primary border-b pb-2 mb-6 mt-8 flex items-center gap-2">
      {children}
    </h3>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href={`/admin/patients/${id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile</Link>
          </Button>
          <Button onClick={handleSubmit} className="bg-primary px-8 rounded-xl shadow-lg" disabled={loading}>
            {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Assessment</>}
          </Button>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <FileText className="h-8 w-8 text-accent" /> HEALTH ASSESSMENT FORM
            </CardTitle>
            <CardDescription className="text-primary-foreground/70">Scientific clinical data entry for Dhanwanthri Maruthuvam</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start rounded-none bg-muted/50 p-0 h-auto flex-wrap border-b">
                <TabsTrigger value="general" className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold">General</TabsTrigger>
                <TabsTrigger value="disorders" className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold">Disorders</TabsTrigger>
                <TabsTrigger value="history" className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold">Histories</TabsTrigger>
                <TabsTrigger value="clinical" className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold">Clinical</TabsTrigger>
                <TabsTrigger value="ayurveda" className="rounded-none px-8 py-4 data-[state=active]:bg-white data-[state=active]:text-primary font-bold">Ayurveda</TabsTrigger>
              </TabsList>

              <div className="p-10">
                <TabsContent value="general" className="mt-0 space-y-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Date</label>
                      <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Visit Type</label>
                      <select className="w-full h-10 border rounded-md px-3" value={formData.visitType} onChange={(e) => setFormData({...formData, visitType: e.target.value})}>
                        <option>Out-patient</option>
                        <option>In-patient</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Doctor in Chief</label>
                      <Input value={formData.doctorChief} onChange={(e) => setFormData({...formData, doctorChief: e.target.value})} />
                    </div>
                  </div>
                  
                  <SectionTitle><Brain className="h-5 w-5" /> Complaints</SectionTitle>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Chief Complaints</label>
                      <textarea className="w-full min-h-[80px] border rounded-xl p-4 text-sm" value={formData.chiefComplaints} onChange={(e) => setFormData({...formData, chiefComplaints: e.target.value})} placeholder="Describe primary symptoms..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Duration</label>
                        <Input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Associate Complaints</label>
                        <Input value={formData.associateComplaints} onChange={(e) => setFormData({...formData, associateComplaints: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="disorders" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-4">
                      <SectionTitle>Digestive (Rasa)</SectionTitle>
                      {['Indigestion', 'Acidity', 'Ulcer', 'IBS', 'Gastritis', 'GERD'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('digestive', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <SectionTitle>Hematological (Raktha)</SectionTitle>
                      {['Anemia', 'Varicose vein', 'Triglyceride', 'Hypertension', 'Cholesterol'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('hematological', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <SectionTitle>Muscular (Mamsa)</SectionTitle>
                      {['Obesity', 'Muscle pain', 'Weight Loss', 'Debility'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('muscular', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <SectionTitle>Skin (Medas)</SectionTitle>
                      {['Itching', 'Vitiligo', 'Psoriasis', 'Discolouration', 'Eczema'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('skin', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <SectionTitle>Skeletal (Asthi)</SectionTitle>
                      {['Osteo Arthritis', 'Disc prolapse', 'Cervical Spondylosis', 'Rheumatoid arthritis', 'Lumbar Spondylosis', 'Sciatica', 'Gout'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('skeletal', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <SectionTitle>Nervous (Majja)</SectionTitle>
                      {["Parkinson's disease", "Alzheimer's disease", 'Paralysis', 'Immunity'].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                          <Checkbox id={d} onCheckedChange={() => handleCheckbox('nervous', d)} />
                          <label htmlFor={d} className="text-sm">{d}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-12">
                  <div>
                    <SectionTitle><History className="h-5 w-5" /> Personal History</SectionTitle>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Appetite</label><Input value={formData.personalHistory.appetite} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, appetite: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Bowel</label><Input value={formData.personalHistory.bowel} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, bowel: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Micturition</label><Input value={formData.personalHistory.micturition} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, micturition: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Sleep</label><Input value={formData.personalHistory.sleep} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, sleep: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Pain</label><Input value={formData.personalHistory.pain} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, pain: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase text-foreground/40">Stress</label><Input value={formData.personalHistory.stress} onChange={(e) => setFormData({...formData, personalHistory: {...formData.personalHistory, stress: e.target.value}})} /></div>
                    </div>
                  </div>

                  <div>
                    <SectionTitle>OB / GYN History (Female Patients)</SectionTitle>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2"><label className="text-xs font-bold">LMPR</label><Input value={formData.obgyn.lmpr} onChange={(e) => setFormData({...formData, obgyn: {...formData.obgyn, lmpr: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold">Menstrual Cycle</label><Input value={formData.obgyn.cycle} onChange={(e) => setFormData({...formData, obgyn: {...formData.obgyn, cycle: e.target.value}})} /></div>
                      <div className="space-y-2"><label className="text-xs font-bold">Flow</label><Input value={formData.obgyn.flow} onChange={(e) => setFormData({...formData, obgyn: {...formData.obgyn, flow: e.target.value}})} /></div>
                    </div>
                  </div>

                  <div>
                    <SectionTitle>Past & Lifestyle History</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {['Hypertension', 'Diabetes', 'Piles', 'Thyroid'].map((h) => (
                          <div key={h} className="flex items-center space-x-2">
                            <Checkbox onCheckedChange={(checked) => setFormData({...formData, pastHistory: {...formData.pastHistory, [h.toLowerCase()]: checked}})} />
                            <label className="text-sm">{h}</label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2"><label className="text-xs font-bold">Water Intake</label><Input value={formData.lifestyle.water} onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, water: e.target.value}})} /></div>
                        <div className="space-y-2"><label className="text-xs font-bold">Physical Activity</label><Input value={formData.lifestyle.physicalActivity} onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, physicalActivity: e.target.value}})} /></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="mt-0 space-y-8">
                  <SectionTitle><Heart className="h-5 w-5" /> Medical Assessment</SectionTitle>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2"><label className="text-sm font-bold">Height</label><Input value={formData.assessment.height} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, height: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">Weight</label><Input value={formData.assessment.weight} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, weight: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">BP</label><Input value={formData.assessment.bp} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, bp: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">Pulse Rate</label><Input value={formData.assessment.pulse} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, pulse: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">Vision</label><Input value={formData.assessment.vision} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, vision: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">Skin</label><Input value={formData.assessment.skin} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, skin: e.target.value}})} /></div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2"><label className="text-sm font-bold">Physical Examination</label><textarea className="w-full border rounded-xl p-4 text-sm" value={formData.assessment.physicalExam} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, physicalExam: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold">Lab Investigation</label><textarea className="w-full border rounded-xl p-4 text-sm" value={formData.assessment.labInvestigation} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, labInvestigation: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-primary">Diagnosis</label><textarea className="w-full border border-primary/20 rounded-xl p-4 text-sm font-bold" value={formData.assessment.diagnosis} onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, diagnosis: e.target.value}})} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="ayurveda" className="mt-0 space-y-8">
                  <SectionTitle><Waves className="h-5 w-5" /> Ayurvedic Diagnostics</SectionTitle>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Dosha</label>
                      <select className="w-full h-12 rounded-xl border border-primary/10 px-4" value={formData.ayurvedic.dosha} onChange={(e) => setFormData({...formData, ayurvedic: {...formData.ayurvedic, dosha: e.target.value}})}>
                        {['Vata', 'Pitha', 'Kapha', 'Vatapitha', 'Vatakapha', 'Pithakapha', 'Vatapithakapha'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Dhatu</label>
                      <select className="w-full h-12 rounded-xl border border-primary/10 px-4" value={formData.ayurvedic.dhatu} onChange={(e) => setFormData({...formData, ayurvedic: {...formData.ayurvedic, dhatu: e.target.value}})}>
                        {['Rasa', 'Raktha', 'Mamsa', 'Medas', 'Asthi', 'Majja', 'Shukra'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Chakra</label>
                      <select className="w-full h-12 rounded-xl border border-primary/10 px-4" value={formData.ayurvedic.chakra} onChange={(e) => setFormData({...formData, ayurvedic: {...formData.ayurvedic, chakra: e.target.value}})}>
                        {['Mooladhara', 'Swadhisthana', 'Manipura', 'Anahatar', 'Vishuddhi', 'Ajna', 'Sahasrara'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Kosha</label>
                      <select className="w-full h-12 rounded-xl border border-primary/10 px-4" value={formData.ayurvedic.kosha} onChange={(e) => setFormData({...formData, ayurvedic: {...formData.ayurvedic, kosha: e.target.value}})}>
                        {['Annamaya', 'Pranamaya', 'Manomaya', 'Vigyanamaya', 'Anandamaya'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Marma / Varma</label>
                    <Input value={formData.ayurvedic.marma} onChange={(e) => setFormData({...formData, ayurvedic: {...formData.ayurvedic, marma: e.target.value}})} placeholder="Specify Marma points..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Associate Doctor</label>
                    <Input value={formData.doctorAssociate} onChange={(e) => setFormData({...formData, doctorAssociate: e.target.value})} />
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
