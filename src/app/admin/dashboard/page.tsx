
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
  Timestamp 
} from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  LogOut,
  Stethoscope,
  Clock,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  XCircle,
  CreditCard,
  UserRound
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [patientCount, setPatientCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchData();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const fetchData = async () => {
    // Fetch all active appointments for the queue
    const qApt = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const snapApt = await getDocs(qApt);
    setAppointments(snapApt.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const snapPatients = await getDocs(collection(db, 'patients'));
    setPatientCount(snapPatients.size);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => router.push('/admin/login'));
  };

  // Filter appointments for the calendar view
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      if (!apt.createdAt) return false;
      const aptDate = apt.createdAt.toDate ? apt.createdAt.toDate() : new Date(apt.createdAt);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const activeDayAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-primary font-bold">Initializing Portal...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/admin/dashboard" className="text-xl font-headline font-bold text-primary">Dhanwanthri Reception</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/admin/patients" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Patients</Link>
            <Link href="/admin/doctor" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Doctor View</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="bg-primary rounded-xl hidden sm:flex">
            <Link href="/admin/patients/new"><PlusCircle className="mr-2 h-4 w-4" /> New Patient</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive"><LogOut className="h-5 w-5" /></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', val: patientCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Waiting Room', val: appointments.filter(a => a.status === 'waiting').length, icon: Clock, color: 'bg-orange-50 text-orange-600' },
            { label: 'In Consultation', val: appointments.filter(a => a.status === 'consultation').length, icon: Stethoscope, color: 'bg-green-50 text-green-600' },
            { label: 'Pending Billing', val: appointments.filter(a => a.status === 'billing').length, icon: CreditCard, color: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Calendar & Daily List */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
              />
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="p-6 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  {selectedDate?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {activeDayAppointments.length > 0 ? (
                  <div className="divide-y">
                    {activeDayAppointments.map(apt => (
                      <div key={apt.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm text-primary">{apt.name}</p>
                            <p className="text-xs text-foreground/60">{apt.service}</p>
                          </div>
                          <Badge className={cn(
                            "text-[10px] h-5",
                            apt.status === 'completed' ? 'bg-green-500' : 
                            apt.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'
                          )}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-foreground/40 italic">
                    No bookings for this date.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Queue Management */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-headline flex items-center gap-3">
                      <Clock className="h-6 w-6 text-accent" /> Active Queue Master
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70">Reception & Workflow Control</CardDescription>
                  </div>
                  <Button asChild variant="secondary" className="bg-white text-primary rounded-xl">
                    <Link href="/admin/appointments">All Bookings</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').map((apt) => (
                    <div key={apt.id} className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/20 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-primary">{apt.name}</p>
                          <Badge variant="outline" className="text-xs">{apt.status}</Badge>
                        </div>
                        <p className="text-sm text-foreground/60 font-medium">{apt.phone} • {apt.service}</p>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase">Booked: {apt.createdAt?.seconds ? new Date(apt.createdAt.seconds * 1000).toLocaleTimeString() : 'Recently'}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {apt.status === 'pending' && (
                          <Button onClick={() => handleUpdateStatus(apt.id, 'waiting')} className="bg-orange-500 hover:bg-orange-600 rounded-xl grow md:grow-0">
                            <Clock className="mr-2 h-4 w-4" /> Move to Waiting Room
                          </Button>
                        )}
                        {apt.status === 'waiting' && (
                          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                            <Clock className="h-4 w-4 animate-pulse" /> Patient Waiting for Doctor
                          </div>
                        )}
                        {apt.status === 'consultation' && (
                          <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                            <Stethoscope className="h-4 w-4 animate-pulse" /> Ongoing Consultation
                          </div>
                        )}
                        {apt.status === 'billing' && (
                          <Button onClick={() => handleUpdateStatus(apt.id, 'completed')} className="bg-purple-600 hover:bg-purple-700 rounded-xl grow md:grow-0">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Close Visit (Payment Received)
                          </Button>
                        )}
                        <Button asChild variant="outline" size="icon" className="rounded-xl border-primary/10">
                          <Link href={`/admin/patients/new?name=${encodeURIComponent(apt.name)}&phone=${apt.phone}`}>
                            <UserPlus className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(apt.id, 'cancelled')} className="rounded-xl text-destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 && (
                    <div className="p-20 text-center text-foreground/40 italic">
                      No active patients in the queue.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
