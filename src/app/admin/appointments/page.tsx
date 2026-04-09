
"use client";

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ArrowLeft, 
  UserPlus, 
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function AppointmentsManagementPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed': return <Badge className="bg-blue-500">Completed</Badge>;
      default: return <Badge className="bg-orange-500">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full text-foreground/60">
            <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <h1 className="text-2xl font-headline font-bold text-primary">Online Bookings</h1>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center">Loading appointments...</div>
          ) : appointments.length > 0 ? (
            appointments.map((apt) => (
              <Card key={apt.id} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className={`w-2 md:w-3 ${apt.status === 'pending' ? 'bg-orange-500' : apt.status === 'confirmed' ? 'bg-green-500' : 'bg-muted'}`} />
                    
                    <div className="flex-grow p-8 grid md:grid-cols-3 gap-8 items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xl text-primary">{apt.name}</p>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-accent" /> {apt.service}
                        </p>
                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">
                          Received: {apt.createdAt?.seconds ? new Date(apt.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <p className="font-bold">{apt.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <p className="truncate">{apt.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {apt.status === 'pending' && (
                          <Button 
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                            size="sm"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                          </Button>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button 
                            onClick={() => updateStatus(apt.id, 'completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                            size="sm"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Check-in
                          </Button>
                        )}
                        <Button asChild variant="outline" className="rounded-xl border-primary/10 text-primary" size="sm">
                          <Link href={`/admin/patients/new?name=${encodeURIComponent(apt.name)}&phone=${apt.phone}&email=${apt.email}`}>
                            <UserPlus className="mr-2 h-4 w-4" /> Register Profile
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteAppointment(apt.id)}
                          className="text-foreground/20 hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {apt.message && (
                    <div className="px-11 pb-8">
                      <div className="bg-muted/50 p-4 rounded-2xl text-sm italic text-foreground/70">
                        "{apt.message}"
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-3xl shadow-sm border-2 border-dashed">
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <p className="text-foreground/40 font-medium italic">No online appointment requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
