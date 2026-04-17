"use client";

import { useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, ArrowLeft, User, Phone } from 'lucide-react';
import Link from 'next/link';

export default function PatientRegistryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !db) return;
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
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="rounded-full text-foreground/60 h-10 px-3 md:px-4">
            <Link href="/admin/dashboard"><ArrowLeft className="md:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span></Link>
          </Button>
          <Button asChild className="bg-primary rounded-2xl h-10 px-4">
            <Link href="/admin/patients/new">
              <PlusCircle className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">New Patient</span><span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">Patient Registry</h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-primary/40" />
              <Input 
                placeholder="Search by mobile number..." 
                className="pl-12 h-12 text-base md:text-lg rounded-2xl border-none shadow-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="bg-accent rounded-2xl px-10 h-12 font-bold w-full sm:w-auto" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>

          <div className="grid gap-4">
            {patients.length > 0 ? patients.map((p) => (
              <Link key={p.id} href={`/admin/patients/${p.id}`}>
                <Card className="border-none shadow-sm hover:shadow-lg transition-all rounded-2xl group overflow-hidden">
                  <CardContent className="p-4 md:p-6 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <User className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-base md:text-lg text-primary truncate">{p.name}</p>
                        <p className="text-xs md:text-sm text-foreground/40 flex items-center gap-1 font-bold">
                          <Phone className="h-3 w-3" /> {p.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-foreground/20 uppercase hidden sm:block">{p.regNo}</p>
                      <p className="text-sm font-bold text-accent">History</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : !loading && (
              <div className="py-20 text-center bg-white rounded-3xl shadow-sm border border-dashed">
                <p className="text-foreground/40 italic px-4">Search for a patient by mobile number to retrieve their clinical history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
