
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where, doc, updateDoc, orderBy } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Receipt, User, CheckCircle2, Clock, Calculator, ShieldCheck } from 'lucide-react';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function BillingDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const q = query(
        collection(db, 'patients'), 
        where('status', '==', 'billing')
      );
      const snap = await getDocs(q);
      setQueue(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (pId: string) => {
    try {
      await updateDoc(doc(db, 'patients', pId), { 
        status: 'completed',
        paymentStatus: 'paid',
        closedAt: new Date().toISOString()
      });
      setQueue(prev => prev.filter(p => p.id !== pId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary">Billing & Settlement</h1>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Financial Clearance Desk</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-primary/5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">Secure Portal</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm rounded-3xl bg-white p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/40 uppercase">Pending Invoices</p>
              <p className="text-2xl font-bold">{queue.length}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white p-6 flex items-center gap-4 md:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/40 uppercase">Registration Policy</p>
              <p className="text-sm font-medium text-foreground/60 italic">Note: First-time assessments incur a baseline registration fee.</p>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-10">
            <CardTitle className="text-2xl flex items-center gap-3 font-headline">
              <Receipt className="h-7 w-7 text-accent" /> Settlement Queue
            </CardTitle>
            <CardDescription className="text-white/50">Patients released from Senior Consultation ready for final payment</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center text-foreground/40 animate-pulse">Calculating balances...</div>
            ) : queue.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {queue.map((p) => (
                  <div key={p.id} className="p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 hover:bg-muted/10 transition-all">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-primary/40 shrink-0">
                        <User className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-primary tracking-tight">{p.name}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">{p.type}</Badge>
                          <Badge variant="outline" className="text-[10px] border-primary/10 text-primary/60">{p.regNo}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow max-w-md bg-accent/5 p-6 rounded-[2rem] border border-accent/10">
                      <p className="text-[10px] font-bold text-accent uppercase mb-3 tracking-widest">Services to Bill:</p>
                      <p className="text-sm font-bold text-slate-900 leading-relaxed italic">
                        {p.suggestedServices || 'Standard Consultation / Review'}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <Button onClick={() => markPaid(p.id)} className="rounded-2xl bg-primary text-white h-16 px-10 grow lg:grow-0 font-bold shadow-xl shadow-primary/20">
                        <CheckCircle2 className="mr-2 h-6 w-6" /> Confirm Payment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center text-foreground/30 italic font-medium">
                No pending settlements. All clear.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
