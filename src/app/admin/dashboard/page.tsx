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
import { DeliveryScheduler } from '@/components/ui/delivery-scheduler';
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
  UserRound,
  LayoutDashboard,
  Search,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [patientCount, setPatientCount] = useState(0);
  const router = useRouter();

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FDhanwanthiri%20Logo.webp?alt=media&token=31a8ab0e-c431-4ea5-a513-324d630ebce4";

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
    try {
      const qApt = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const snapApt = await getDocs(qApt);
      setAppointments(snapApt.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const snapPatients = await getDocs(collection(db, 'patients'));
      setPatientCount(snapPatients.size);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
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

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      if (!apt.createdAt) return false;
      const aptDate = apt.createdAt.toDate ? apt.createdAt.toDate() : new Date(apt.createdAt);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const activeDayAppointments = getAppointmentsForDate(selectedDate);

  const availableTimeSlots = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-primary font-bold">Initializing Portal...</div>;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-white border-b px-4 md:px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="relative h-10 w-24 md:h-12 md:w-32 transition-all">
              <Image src={logoUrl} alt="Logo" fill className="object-contain" />
            </Link>
            <div className="h-6 w-px bg-muted hidden md:block" />
            <span className="text-sm font-bold text-primary tracking-tight hidden md:block">Clinical Dashboard</span>
          </div>
          <nav className="hidden md:flex gap-1 bg-muted/50 p-1 rounded-xl border">
            <Link href="/admin/dashboard" className="px-4 py-2 text-sm font-bold bg-white text-primary rounded-lg shadow-sm">Dashboard</Link>
            <Link href="/admin/patients" className="px-4 py-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Patients</Link>
            <Link href="/admin/doctor" className="px-4 py-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Doctor View</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="bg-primary rounded-xl hidden sm:flex font-bold">
            <Link href="/admin/patients/new"><PlusCircle className="mr-2 h-4 w-4" /> New Patient</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive rounded-xl hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Registered Patients', val: patientCount, icon: Users, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
            { label: 'Waiting Room', val: appointments.filter(a => a.status === 'waiting').length, icon: Clock, color: 'bg-amber-50 text-orange-600', border: 'border-amber-100' },
            { label: 'Ongoing Consultations', val: appointments.filter(a => a.status === 'consultation').length, icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
            { label: 'Pending Settlement', val: appointments.filter(a => a.status === 'billing').length, icon: CreditCard, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
          ].map((stat, i) => (
            <Card key={i} className={cn("border bg-white rounded-3xl shadow-sm transition-all hover:shadow-md", stat.border)}>
              <CardContent className="p-6 flex items-center gap-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 leading-none">{stat.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Scheduler Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <DeliveryScheduler 
              initialDate={selectedDate}
              timeSlots={availableTimeSlots}
              timeZone="Chennai (GMT +5:30)"
              onSchedule={({ date }) => setSelectedDate(date)}
              onDateSelect={setSelectedDate}
              className="border-none shadow-xl rounded-[2.5rem] bg-white ring-1 ring-black/5"
            />

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="p-6 border-b bg-muted/30">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center gap-2 font-bold text-primary">
                    <Clock className="h-4 w-4 text-accent" />
                    {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] bg-white">{activeDayAppointments.length} Bookings</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                {activeDayAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {activeDayAppointments.map(apt => (
                      <div key={apt.id} className="p-5 hover:bg-muted/30 transition-colors flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-slate-900">{apt.name}</p>
                          <p className="text-[11px] font-medium text-foreground/50">{apt.service}</p>
                        </div>
                        <Badge className={cn(
                          "text-[9px] px-2 h-5 rounded-md border-none",
                          apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'
                        )}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center text-xs text-foreground/30 italic">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    No activity for this day.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workflow Queue */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden min-h-[600px]">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                      <LayoutDashboard className="h-8 w-8 text-primary" /> Active Patient Flow
                    </CardTitle>
                    <CardDescription className="text-white/50 font-medium">Real-time Clinical Workflow & Queue Control</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl">
                      <Link href="/admin/appointments">Appointment Registry</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').map((apt) => (
                    <div key={apt.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:bg-muted/10 transition-all group">
                      <div className="flex items-start gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                          apt.status === 'waiting' ? "bg-amber-100 text-orange-600 animate-pulse" : 
                          apt.status === 'consultation' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                          <UserRound className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-slate-900 tracking-tight">{apt.name}</p>
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest px-2">{apt.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground/60 font-medium">{apt.phone} <span className="mx-2 text-muted-foreground/30">•</span> {apt.service}</p>
                          <div className="flex items-center gap-4 pt-1">
                            <p className="text-[10px] font-bold text-foreground/30 uppercase flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Booked: {apt.createdAt?.seconds ? new Date(apt.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {apt.status === 'pending' && (
                          <Button onClick={() => handleUpdateStatus(apt.id, 'waiting')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl grow md:grow-0 font-bold shadow-lg shadow-orange-500/20">
                            <UserPlus className="mr-2 h-4 w-4" /> Move to Waiting Room
                          </Button>
                        )}
                        {apt.status === 'waiting' && (
                          <div className="flex items-center gap-3 text-orange-600 font-bold text-sm bg-orange-50 px-5 py-3 rounded-2xl border border-orange-100 shadow-sm">
                            <Clock className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} /> Awaiting Physician
                          </div>
                        )}
                        {apt.status === 'consultation' && (
                          <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                            <Stethoscope className="h-4 w-4 animate-pulse" /> In Consultation
                          </div>
                        )}
                        {apt.status === 'billing' && (
                          <Button onClick={() => handleUpdateStatus(apt.id, 'completed')} className="bg-primary hover:bg-primary/90 text-white rounded-xl grow md:grow-0 font-bold shadow-lg shadow-primary/20">
                            <CreditCard className="mr-2 h-4 w-4" /> Settle & Close Visit
                          </Button>
                        )}
                        
                        <div className="flex gap-1">
                          <Button asChild variant="outline" size="icon" className="rounded-xl border-slate-200 hover:border-primary hover:text-primary transition-all">
                            <Link href={`/admin/patients/new?name=${encodeURIComponent(apt.name)}&phone=${apt.phone}`}>
                              <UserPlus className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(apt.id, 'cancelled')} className="rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-dashed">
                        <UserRound className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-medium italic">Clinical queue is currently empty.</p>
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
