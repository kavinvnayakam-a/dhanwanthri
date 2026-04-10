
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where, doc, updateDoc, orderBy } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Receipt, 
  User, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Search,
  Calendar,
  ArrowLeft,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function BillingDashboard() {
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [settledArchive, setSettledArchive] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unpaid');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Fetch Unpaid
      const qUnpaid = query(
        collection(db, 'patients'), 
        where('status', '==', 'billing'),
        where('paymentStatus', '==', 'unpaid'),
        orderBy('consultationCompletedAt', 'desc')
      );
      const snapUnpaid = await getDocs(qUnpaid);
      setPendingQueue(snapUnpaid.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Paid (Recent)
      const qPaid = query(
        collection(db, 'patients'), 
        where('paymentStatus', '==', 'paid'),
        orderBy('settledAt', 'desc'),
        where('status', '==', 'completed')
      );
      const snapPaid = await getDocs(qPaid);
      setSettledArchive(snapPaid.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (pId: string) => {
    try {
      const pRef = doc(db, 'patients', pId);
      const updateData = { 
        status: 'completed',
        paymentStatus: 'paid',
        settledAt: new Date().toISOString()
      };
      await updateDoc(pRef, updateData);
      
      // Update local state
      const patient = pendingQueue.find(p => p.id === pId);
      setPendingQueue(prev => prev.filter(p => p.id !== pId));
      if (patient) {
        setSettledArchive(prev => [{ ...patient, ...updateData }, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-xl">
            <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary">Revenue Desk</h1>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Financial Settlement & Billing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-primary/5">
            <Calendar className="h-4 w-4 text-primary" />
            <Input 
              type="date" 
              className="border-none bg-transparent h-6 p-0 text-xs font-bold text-primary focus-visible:ring-0" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 uppercase">Secure</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <TabsList className="bg-white p-1 rounded-2xl border h-14 shadow-sm">
              <TabsTrigger value="unpaid" className="rounded-xl px-8 h-full data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">
                Pending Settlements <Badge className="ml-2 bg-orange-500 h-5 px-1.5">{pendingQueue.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="paid" className="rounded-xl px-8 h-full data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">
                Settled Archive
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-foreground/20" />
              <Input placeholder="Patient or Mobile..." className="pl-12 h-12 rounded-2xl border-none shadow-sm" />
            </div>
          </div>

          <TabsContent value="unpaid">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-32 text-center text-foreground/20 animate-pulse font-bold uppercase tracking-widest">Accessing Ledger...</div>
                ) : pendingQueue.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {pendingQueue.map((p) => (
                      <div key={p.id} className="p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 hover:bg-muted/10 transition-all group">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                            <User className="h-8 w-8" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-2xl font-bold text-primary tracking-tight">{p.name}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-indigo-100 text-indigo-600">{p.type}</Badge>
                              <Badge variant="outline" className="text-[10px] border-slate-100 text-slate-400">{p.regNo}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow max-w-md space-y-4">
                          <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100/50">
                            <p className="text-[10px] font-bold text-orange-600 uppercase mb-3 tracking-widest flex items-center gap-2">
                              <Filter className="h-3 w-3" /> Services Rendered
                            </p>
                            <p className="text-sm font-bold text-slate-900 italic leading-relaxed">
                              {p.suggestedServices || 'Standard Clinical Consultation'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                          <div className="text-center lg:text-right">
                            <p className="text-[10px] font-bold text-foreground/40 uppercase mb-1 tracking-widest">Total Amount Due</p>
                            <p className="text-4xl font-bold text-slate-900 flex items-center justify-center lg:justify-end">
                              <IndianRupee className="h-6 w-6 text-accent" /> {p.treatmentAmount || 0}
                            </p>
                          </div>
                          <Button 
                            onClick={() => markPaid(p.id)} 
                            className="rounded-2xl bg-primary hover:bg-primary/90 text-white h-16 px-10 w-full sm:w-auto font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
                          >
                            <CheckCircle2 className="mr-2 h-6 w-6" /> Confirm Payment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-40 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border-2 border-dashed">
                      <Clock className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-medium italic">Pending queue is clear. No settlements waiting.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {settledArchive.map((p) => (
                    <div key={p.id} className="p-8 flex justify-between items-center opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs font-bold text-foreground/40 uppercase">{p.regNo} • {p.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600 flex items-center justify-end">
                          <IndianRupee className="h-4 w-4" /> {p.treatmentAmount}
                        </p>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase">Settled: {p.settledAt ? new Date(p.settledAt).toLocaleDateString() : 'Archive'}</p>
                      </div>
                    </div>
                  ))}
                  {settledArchive.length === 0 && (
                    <div className="p-32 text-center text-foreground/20 italic">No settlement history found for this period.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
