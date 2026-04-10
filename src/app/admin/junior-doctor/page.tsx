
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  ClipboardList, 
  User, 
  ArrowRight, 
  Clock, 
  Timer, 
  CheckCircle2, 
  Users,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function JuniorDoctorDashboard() {
  const [registryQueue, setRegistryQueue] = useState<any[]>([]);
  const [waitingRoom, setWaitingRoom] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubRegistry = onSnapshot(
      query(collection(db, 'patients'), where('status', '==', 'enrolled'), orderBy('createdAt', 'asc')),
      (snap) => setRegistryQueue(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );

    const unsubWaiting = onSnapshot(
      query(collection(db, 'patients'), where('status', '==', 'waiting'), orderBy('lastVisit', 'asc')),
      (snap) => setWaitingRoom(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );

    setLoading(false);
    return () => {
      unsubRegistry();
      unsubWaiting();
    };
  }, []);

  const sendToSenior = async (patientId: string) => {
    try {
      // Move patient from 'waiting' (waiting room) to 'review' (Senior Doctor's list)
      await updateDoc(doc(db, 'patients', patientId), { 
        status: 'review',
        sentToSeniorAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error sending to senior doctor:", err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-white border-b px-8 py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-bold text-primary">Clinical Assessment Portal</h1>
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Junior Physician Workspace</p>
            </div>
          </div>
          <Button variant="ghost" asChild className="rounded-xl"><Link href="/admin/dashboard">Reception View</Link></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8">
        
        {/* Registry Queue: Needs Assessment */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-xl flex items-center gap-3">
                <ClipboardList className="h-6 w-6 text-primary" /> Registry Queue
              </CardTitle>
              <CardDescription className="text-white/50">Patients enrolled by receptionist needing assessment</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-20 text-center text-foreground/40 animate-pulse">Syncing...</div>
              ) : registryQueue.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {registryQueue.map((p) => (
                    <div key={p.id} className="p-8 flex justify-between items-center hover:bg-muted/10 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary/40">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-primary">{p.name}</p>
                          <p className="text-xs font-medium text-foreground/60">{p.regNo} • {p.phone}</p>
                        </div>
                      </div>
                      <Button asChild className="rounded-xl bg-primary text-white h-11 px-6 font-bold shadow-lg shadow-primary/10">
                        <Link href={`/admin/patients/${p.id}/assessment/new`}>
                          Assess <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-24 text-center text-foreground/20 italic text-sm">No patients pending assessment.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Waiting Room: Assessed & Ready to Send */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-2 border-accent/10">
            <CardHeader className="bg-accent text-white p-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Timer className="h-6 w-6 text-white" /> Clinical Waiting Room
                  </CardTitle>
                  <CardDescription className="text-white/70">Assessments complete. Call patient to Senior Consultation.</CardDescription>
                </div>
                <Badge className="bg-white/20 text-white border-none px-4 py-1.5 font-bold">{waitingRoom.length} IN ROOM</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {waitingRoom.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {waitingRoom.map((p) => (
                    <div key={p.id} className="p-8 flex justify-between items-center hover:bg-accent/5 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                          <Timer className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-slate-900">{p.name}</p>
                          <p className="text-sm font-medium text-foreground/60">ID: {p.regNo}</p>
                          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Assessment Ready</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => sendToSenior(p.id)}
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white h-14 px-8 font-bold shadow-xl shadow-slate-200"
                      >
                        Send to Senior <ArrowRight className="ml-2 h-5 w-5 text-accent" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-32 flex flex-col items-center justify-center text-center space-y-4">
                  <Users className="h-12 w-12 text-slate-100" />
                  <p className="text-slate-300 font-medium italic">Waiting room is empty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
