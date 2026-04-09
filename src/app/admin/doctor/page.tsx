
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
  addDoc
} from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  Activity,
  History,
  User,
  HeartPulse,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consultationData, setConsultationData] = useState({
    prescription: '',
    workoutPlan: '',
    nextVisitDate: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchQueue();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const fetchQueue = async () => {
    const q = query(
      collection(db, 'appointments'), 
      where('status', 'in', ['waiting', 'consultation']),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQueue(docs);
    
    // Auto-set the patient who is already in consultation
    const active = docs.find(a => a.status === 'consultation');
    if (active) setCurrentPatient(active);
  };

  const startConsultation = async (apt: any) => {
    try {
      await updateDoc(doc(db, 'appointments', apt.id), { status: 'consultation' });
      setCurrentPatient({ ...apt, status: 'consultation' });
      setQueue(prev => prev.map(a => a.id === apt.id ? { ...a, status: 'consultation' } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const closeConsultation = async () => {
    if (!currentPatient) return;
    try {
      await updateDoc(doc(db, 'appointments', currentPatient.id), { 
        status: 'billing',
        ...consultationData 
      });
      
      // Optionally create a health assessment record here if desired
      
      setCurrentPatient(null);
      setConsultationData({ prescription: '', workoutPlan: '', nextVisitDate: '', notes: '' });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Clinical Workspace...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-headline font-bold text-primary">Doctor's Consultation Portal</h1>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="ghost" size="sm" className="text-foreground/60"><Link href="/admin/dashboard">Reception View</Link></Button>
          <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-destructive"><LogOut className="h-5 w-5" /></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Patient Queue */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> Waiting Room Queue
              </CardTitle>
              <CardDescription className="text-white/60">Patients ready for consultation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {queue.filter(a => a.status === 'waiting').map((apt, idx) => (
                  <div key={apt.id} className="p-6 hover:bg-muted/30 transition-colors group">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="font-bold text-primary flex items-center gap-2">
                          <span className="text-xs text-foreground/20">#{idx + 1}</span> {apt.name}
                        </p>
                        <p className="text-xs font-medium text-foreground/40">{apt.service}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => startConsultation(apt)}
                        disabled={!!currentPatient}
                        className="rounded-xl bg-accent text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Call Patient <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {queue.filter(a => a.status === 'waiting').length === 0 && (
                  <div className="p-12 text-center text-foreground/40 italic text-sm">
                    Waiting room is empty.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Consultation Workspace */}
        <div className="lg:col-span-8">
          {currentPatient ? (
            <Card className="border-none shadow-2xl rounded-3xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-primary text-white p-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <Badge className="bg-white text-primary mb-1">Ongoing Consultation</Badge>
                        <CardTitle className="text-2xl font-headline">{currentPatient.name}</CardTitle>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase opacity-60">Mobile</p>
                    <p className="text-lg font-bold">{currentPatient.phone}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <ClipboardList className="h-5 w-5" />
                      <h3>Clinical Prescription</h3>
                    </div>
                    <Textarea 
                      placeholder="List medicines, dosages, and duration..." 
                      className="min-h-[150px] rounded-2xl border-primary/10 bg-muted/30 p-4"
                      value={consultationData.prescription}
                      onChange={(e) => setConsultationData({...consultationData, prescription: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Activity className="h-5 w-5" />
                      <h3>Recovery & Workout Plan</h3>
                    </div>
                    <Textarea 
                      placeholder="Stretches, exercises, or activity restrictions..." 
                      className="min-h-[150px] rounded-2xl border-primary/10 bg-muted/30 p-4"
                      value={consultationData.workoutPlan}
                      onChange={(e) => setConsultationData({...consultationData, workoutPlan: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <History className="h-5 w-5" />
                      <h3>Follow-up Schedule</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground/40 uppercase">Recommended Next Visit Date</label>
                      <Input 
                        type="date" 
                        className="rounded-xl border-primary/10 h-12" 
                        value={consultationData.nextVisitDate}
                        onChange={(e) => setConsultationData({...consultationData, nextVisitDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <HeartPulse className="h-5 w-5" />
                      <h3>Final Consultation Notes</h3>
                    </div>
                    <Textarea 
                      placeholder="Doctor's internal observations..." 
                      className="min-h-[100px] rounded-2xl border-primary/10"
                      value={consultationData.notes}
                      onChange={(e) => setConsultationData({...consultationData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={closeConsultation}
                    className="w-full h-16 rounded-2xl bg-slate-900 text-lg font-bold hover:bg-slate-800 shadow-xl"
                  >
                    <CheckCircle2 className="mr-2 h-6 w-6 text-accent" /> Finalize & Send to Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed gap-4 text-foreground/30">
              <HeartPulse className="h-20 w-20" />
              <p className="text-lg font-medium italic">Select a patient from the queue to start consultation</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
