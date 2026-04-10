
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, ClipboardList, User, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function JuniorDoctorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      // Patients enrolled by receptionist but not yet assessed
      const q = query(
        collection(db, 'patients'), 
        where('status', '==', 'enrolled'),
        orderBy('createdAt', 'asc')
      );
      const snap = await getDocs(q);
      setQueue(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
              <h1 className="text-2xl font-headline font-bold text-primary">Junior Doctor Portal</h1>
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Enrolled Patient Assessments</p>
            </div>
          </div>
          <Button variant="ghost" asChild className="rounded-xl"><Link href="/admin/dashboard">Reception View</Link></Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle className="text-xl flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-primary" /> Assessment Pending Queue
            </CardTitle>
            <CardDescription className="text-white/50">Patients successfully enrolled and ready for health evaluation</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center text-foreground/40 animate-pulse">Synchronizing clinical queue...</div>
            ) : queue.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {queue.map((p) => (
                  <div key={p.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary/40 shrink-0">
                        <User className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-primary">{p.name}</p>
                        <p className="text-sm font-medium text-foreground/60">{p.phone} • {p.type}</p>
                        <Badge variant="outline" className="mt-2 text-[10px] uppercase font-bold tracking-widest text-primary/60 border-primary/10">ID: {p.regNo}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="hidden md:block text-right">
                        <p className="text-[10px] font-bold uppercase text-foreground/30 flex items-center gap-1 justify-end">
                          <Clock className="h-3 w-3" /> Enrolled
                        </p>
                        <p className="text-xs font-bold text-foreground/60">
                          {p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                      <Button asChild className="rounded-xl bg-accent text-white px-8 h-12 grow md:grow-0 font-bold">
                        <Link href={`/admin/patients/${p.id}/assessment/new`}>
                          Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center text-foreground/30 italic">
                The assessment queue is currently clear.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
