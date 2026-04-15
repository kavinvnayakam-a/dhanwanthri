"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc,
  where,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  HeartPulse,
  LogOut,
  FileSearch,
  Zap,
  UserRound,
  History,
  Activity,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  TrendingUp,
  Clock,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';

export default function SeniorDoctorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [attendedHistory, setAttendedHistory] = useState<any[]>([]);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendedToday: 0,
    waitingCount: 0
  });
  const [consultationData, setConsultationData] = useState({
    prescription: '',
    workoutPlan: '',
    nextVisitDate: '',
    seniorNotes: '',
    suggestedServices: '',
    treatmentAmount: ''
  });
  const router = useRouter();

  const startListeners = useCallback(() => {
    if (!db) return () => {};
    const unsubs: (() => void)[] = [];

    const qQueue = query(
      collection(db, 'patients'), 
      where('status', '==', 'review'),
      orderBy('sentToSeniorAt', 'asc')
    );
    const unsubQueue = onSnapshot(qQueue, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQueue(docs);
      setStats(prev => ({ ...prev, waitingCount: docs.length }));
    }, async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'patients (waiting)', operation: 'list' }));
      }
    });
    unsubs.push(unsubQueue);

    const qHistory = query(
      collection(db, 'patients'),
      where('status', 'in', ['billing', 'completed']),
      orderBy('consultationCompletedAt', 'desc'),
      limit(10)
    );
    const unsubHistory = onSnapshot(qHistory, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAttendedHistory(docs);
      setStats(prev => ({ ...prev, attendedToday: snap.size }));
    }, async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'patients (history)', operation: 'list' }));
      }
    });
    unsubs.push(unsubHistory);

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let cleanup: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        cleanup = startListeners();
      } else {
        if (cleanup) cleanup();
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => {
      unsubAuth();
      if (cleanup) cleanup();
    };
  }, [router, startListeners]);

  const loadPatientAssessment = async (p: any) => {
    if (!db) return;
    setCurrentPatient(p);
    try {
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
          suggestedServices: data.suggestedServices || '',
          treatmentAmount: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeConsultation = async () => {
    if (!currentPatient || !db) return;
    const docRef = doc(db, 'patients', currentPatient.id);
    const data = { 
      status: 'billing',
      paymentStatus: 'unpaid',
      consultationComplete: true,
      consultationCompletedAt: new Date().toISOString(),
      ...consultationData,
      treatmentAmount: parseFloat(consultationData.treatmentAmount) || 0
    };

    updateDoc(docRef, data)
      .then(() => {
        setCurrentPatient(null);
        setAssessment(null);
        setConsultationData({ 
          prescription: '', 
          workoutPlan: '', 
          nextVisitDate: '', 
          seniorNotes: '', 
          suggestedServices: '',
          treatmentAmount: ''
        });
      })
      .catch(async (err) => {
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data
          }));
        }
      });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-primary">Clinical Portal Initializing...</div>;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <HeartPulse className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold text-primary">Senior Clinical Portal</h1>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Medical Analysis & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">Active Practitioner Session</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => auth?.signOut()} className="text-destructive rounded-xl hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Attended So Far</p>
              <p className="text-3xl font-bold text-slate-900">{stats.attendedToday}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-orange-600">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Waiting in Queue</p>
              <p className="text-3xl font-bold text-slate-900">{stats.waitingCount}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white p-6 flex items-center gap-5 md:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Clinical Performance</p>
              <p className="text-sm font-medium text-foreground/60 leading-tight">Optimizing human movement since 7 AM</p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2 font-headline">
                    <UserRound className="h-5 w-5 text-accent" /> Waiting Room
                  </CardTitle>
                  <Badge className="bg-primary/20 text-primary border-none">{queue.length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                <div className="divide-y divide-slate-50">
                  {queue.map((p, idx) => (
                    <div 
                      key={p.id} 
                      className={cn(
                        "p-6 hover:bg-muted/30 transition-all cursor-pointer group",
                        currentPatient?.id === p.id && "bg-accent/5 border-l-4 border-accent"
                      )} 
                      onClick={() => loadPatientAssessment(p)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-bold text-primary tracking-tight">{p.name}</p>
                          <p className="text-[10px] font-bold text-foreground/40 uppercase">{p.regNo}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-foreground/20 group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <div className="p-16 text-center text-foreground/20 italic text-sm">No patients waiting.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden opacity-80">
              <CardHeader className="p-6 border-b bg-muted/30">
                <CardTitle className="text-sm flex items-center gap-2 font-bold text-foreground/40 uppercase tracking-widest">
                  <History className="h-4 w-4" /> Recent Consultations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {attendedHistory.map(p => (
                    <div key={p.id} className="p-5 flex justify-between items-center opacity-60">
                      <div>
                        <p className="font-bold text-sm text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-foreground/40">{p.regNo}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {currentPatient ? (
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary text-white p-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-white text-primary px-4 py-1 font-bold">In-Consultation</Badge>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">ID: {currentPatient.regNo}</span>
                      </div>
                      <CardTitle className="text-4xl font-headline tracking-tight">{currentPatient.name}</CardTitle>
                      <p className="text-sm font-bold opacity-80">{currentPatient.phone} • {currentPatient.sex}, {currentPatient.age} years</p>
                    </div>
                    <Button variant="ghost" onClick={() => setCurrentPatient(null)} className="text-white/60 hover:text-white hover:bg-white/10">
                      <FileSearch className="h-6 w-6" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-10 space-y-12">
                  {assessment && (
                    <div className="bg-muted/30 p-8 rounded-[2rem] border border-primary/5 space-y-6">
                      <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                        <ClipboardCheck className="h-4 w-4" /> Junior Assessment Summary
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Chief Complaints</p>
                          <p className="text-sm font-bold text-slate-900 leading-relaxed italic">"{assessment.chiefComplaints}"</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Assessed Vital (BP/P)</p>
                          <p className="text-sm font-bold text-slate-900">{assessment.assessment?.bp || 'N/A'} / {assessment.assessment?.pulse || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Provisional Diagnosis</p>
                        <p className="text-lg font-bold text-indigo-600 underline decoration-indigo-100 underline-offset-4">{assessment.assessment?.diagnosis || 'Pending'}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                        <Zap className="h-4 w-4 text-accent" /> Final Prescription
                      </label>
                      <Textarea 
                        placeholder="Clinical medications..." 
                        className="min-h-[180px] rounded-3xl border-primary/10 p-6 shadow-inner bg-slate-50/50"
                        value={consultationData.prescription}
                        onChange={(e) => setConsultationData({...consultationData, prescription: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                        <Activity className="h-4 w-4 text-accent" /> Recovery & Workout Plan
                      </label>
                      <Textarea 
                        placeholder="Home care and exercise protocol..." 
                        className="min-h-[180px] rounded-3xl border-primary/10 p-6 shadow-inner font-bold bg-accent/5"
                        value={consultationData.workoutPlan}
                        onChange={(e) => setConsultationData({...consultationData, workoutPlan: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 pt-6 border-t">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                        <History className="h-4 w-4 text-accent" /> Follow-up Date
                      </label>
                      <Input 
                        type="date" 
                        className="h-14 rounded-2xl border-primary/10 px-6 font-bold" 
                        value={consultationData.nextVisitDate}
                        onChange={(e) => setConsultationData({...consultationData, nextVisitDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                      <label className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest">
                        <IndianRupee className="h-4 w-4 text-accent" /> Treatment Fees (INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-4.5 font-bold text-foreground/30">₹</span>
                        <Input 
                          type="number" 
                          placeholder="Set amount for billing desk..." 
                          className="h-14 rounded-2xl border-primary/10 pl-10 pr-6 font-bold text-lg bg-emerald-50/30" 
                          value={consultationData.treatmentAmount}
                          onChange={(e) => setConsultationData({...consultationData, treatmentAmount: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={closeConsultation}
                    className="w-full h-20 rounded-3xl bg-slate-900 text-xl font-bold hover:bg-slate-800 shadow-2xl transition-all"
                  >
                    <CheckCircle2 className="mr-3 h-8 w-8 text-accent" /> Finalize & Send to Billing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="h-[700px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-primary/10 gap-6 text-foreground/30 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <HeartPulse className="h-12 w-12 opacity-20" />
                </div>
                <p className="text-xl font-headline font-medium italic">Consultation Suite Ready</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
