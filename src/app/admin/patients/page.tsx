
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, ArrowLeft, User, Phone } from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function PatientRegistryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const q = query(
        collection(db, 'patients'), 
        where('phone', '>=', searchTerm),
        where('phone', '<=', searchTerm + '\uf8ff')
      );
      const snap = await getDocs(q);
      setPatients(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full text-foreground/60">
            <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <Button asChild className="bg-primary rounded-2xl">
            <Link href="/admin/patients/new">
              <PlusCircle className="mr-2 h-4 w-4" /> New Patient
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-headline font-bold text-primary">Patient Registry</h1>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-primary/40" />
              <Input 
                placeholder="Search by mobile number..." 
                className="pl-12 h-12 text-lg rounded-2xl border-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="bg-accent rounded-2xl px-10 h-12 font-bold" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>

          <div className="grid gap-4">
            {patients.length > 0 ? patients.map((p) => (
              <Link key={p.id} href={`/admin/patients/${p.id}`}>
                <Card className="border-none shadow-sm hover:shadow-xl transition-all rounded-2xl group overflow-hidden">
                  <CardContent className="p-6 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-primary">{p.name}</p>
                        <p className="text-sm text-foreground/40 flex items-center gap-1 font-bold">
                          <Phone className="h-3 w-3" /> {p.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground/20 uppercase">{p.regNo}</p>
                      <p className="text-sm font-bold text-accent">View History</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : (
              <div className="py-20 text-center bg-white rounded-3xl shadow-sm">
                <p className="text-foreground/40 italic">Search for a patient by mobile number to see their history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
