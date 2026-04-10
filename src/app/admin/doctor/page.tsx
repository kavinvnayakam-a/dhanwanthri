
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  getFirestore, 
  doc, 
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ClipboardCheck,
  Activity,
  History,
  HeartPulse,
  LogOut,
  FileSearch,
  Zap,
  UserRound
} from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export default function SeniorDoctorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consultationData, setConsultationData] = useState({
    prescription: '',
    workoutPlan: '',
    nextVisitDate: '',
    seniorNotes: '',
    suggestedServices: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        startQueueListener();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, [router]);

  const startQueueListener = () => {
    // Only see patients who have been "Sent" by the junior doctor (status: review)
    const q = query(
      collection(db, 'patients'), 
      where('status', '==', 'review'),
      orderBy('sentToSeniorAt', 'asc')
    );
    
    return onSnapshot(q, (snap) => {
      setQueue(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadPatientAssessment = async (p: any) => {
    setCurrentPatient(p);
    try {
      // Find the most recent assessment
      const q = query(
        collection(db, 'patients', p.id, 'assessments'),
        orderBy('date', 'desc')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setAssessment(data);
        setConsultationData({
          ...consultationData,
          suggestedServices: data.suggestedServices || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeConsultation = async () => {
    if (!currentPatient) return;
    try {
      // Move to billing
      await updateDoc(doc(db, 'patients', currentPatient.id), { 
        status: 'billing',
        consultationComplete: true,
        ...consultationData 
      });
      
      setCurrentPatient(null);
      setAssessment(null);
      setConsultationData({ prescription: '', workoutPlan: '', nextVisitDate: '', seniorNotes: '', suggestedServices: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-primary">Senior Clinical Portal Initializing...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <HeartPulse className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold text-primary">Senior Physician Dashboard</h1>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Clinical Review & Consultation</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="ghost" size="sm" className="text-foreground/60"><Link href="/admin/junior-doctor">Junior Portal</Link></Button>
          <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-destructive"><LogOut className="h-5 w-5" /></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-12 gap-8">
        
        {/* Patient Review Queue */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2 font-headline">
                  <UserRound className="h-5 w-5 text-accent" /> Ready for Review
                </CardTitle>
                <Badge className="bg-primary text-white border-none">{queue.length} Ready</Badge>
              </div>
              <CardDescription className="text-white/60">Patients cleared by Junior Doctor waiting for consultation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {queue.map((p, idx) => (
                  <div key={p.id} className="p-6 hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => loadPatientAssessment(p)}>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="font-bold text-primary flex items-center gap-2">
                          <span className="text-xs text-foreground/20">#{idx + 1}</span> {p.name}
                        </p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">{p.phone}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="rounded-xl text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Start <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {queue.length === 0 && (
                  <div className="p-16 text-center text-foreground/30 italic text-sm">
                    No patients currently waiting for review.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Review Workspace */}
        <div className="lg:col-span-8">
          {currentPatient ? (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              <CardHeader className="bg-primary text-white p-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <Badge className="bg-white text-primary px-4 py-1 font-bold">Consultation Active</Badge>
                    <CardTitle className="text-4xl font-headline tracking-tight">{currentPatient.name}</CardTitle>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-widest opacity-70">
                      <span>ID: {currentPatient.regNo}</span>
                      <span>{currentPatient.phone}</span>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setCurrentPatient(null)} className="text-white/60 hover:text-white hover:bg-white/10"><FileSearch className="h-6 w-6" /></Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-10 space-y-12">
                {/* Junior Doctor's Assessment Summary */}
                {assessment && (
                  <div className="bg-muted/30 p-8 rounded-[2rem] border border-primary/5 space-y-6">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                      <ClipboardCheck className="h-4 w-4" /> Junior Assessment Summary
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Provisional Diagnosis</p>
                        <p className="text-lg font-bold text-slate-900 leading-tight">{assessment.assessment?.diagnosis || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Chief Complaints</p>
                        <p className="text-sm text-foreground/70">{assessment.chiefComplaints}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Junior suggested Services</p>
                      <p className="text-sm text-accent font-bold italic">{assessment.suggestedServices || 'No services pre-suggested'}</p>
                    </div>
                  </div>
                )}

                {/* Senior Doctor Intervention */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                      <Zap className="h-4 w-4 text-accent" /> Final Prescription
                    </div>
                    <Textarea 
                      placeholder="Medicines and dosages..." 
                      className="min-h-[180px] rounded-3xl border-primary/10 bg-white p-6 shadow-inner"
                      value={consultationData.prescription}
                      onChange={(e) => setConsultationData({...consultationData, prescription: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                      <Activity className="h-4 w-4 text-accent" /> Final Recovery & Workout Plan
                    </div>
                    <Textarea 
                      placeholder="Specify therapeutic exercises and home care..." 
                      className="min-h-[180px] rounded-3xl border-primary/10 bg-accent/5 p-6 shadow-inner font-bold"
                      value={consultationData.workoutPlan}
                      onChange={(e) => setConsultationData({...consultationData, workoutPlan: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 pt-6 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                      <History className="h-4 w-4 text-accent" /> Follow-up Date
                    </div>
                    <Input 
                      type="date" 
                      className="h-14 rounded-2xl border-primary/10 px-6 font-bold" 
                      value={consultationData.nextVisitDate}
                      onChange={(e) => setConsultationData({...consultationData, nextVisitDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                      <Activity className="h-4 w-4 text-accent" /> Suggested Billing Services
                    </div>
                    <Textarea 
                      placeholder="Services for billing desk (e.g. 5 days Panchakarma)..." 
                      className="min-h-[100px] rounded-2xl border-primary/10 p-4"
                      value={consultationData.suggestedServices}
                      onChange={(e) => setConsultationData({...consultationData, suggestedServices: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={closeConsultation}
                  className="w-full h-20 rounded-3xl bg-slate-900 text-xl font-bold hover:bg-slate-800 shadow-2xl transition-all active:scale-95"
                >
                  <CheckCircle2 className="mr-3 h-8 w-8 text-accent" /> Complete Consultation & Send to Billing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[700px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-primary/10 gap-6 text-foreground/30 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <FileSearch className="h-12 w-12 opacity-20" />
              </div>
              <p className="text-xl font-headline font-medium italic">Select a patient profile to begin consultation</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
