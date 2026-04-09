
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { collection, query, orderBy, limit, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Calendar, 
  PlusCircle, 
  Search, 
  LogOut,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchRecentData();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const fetchRecentData = async () => {
    const qApt = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'), limit(5));
    const snapApt = await getDocs(qApt);
    setAppointments(snapApt.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const snapPatients = await getDocs(collection(db, 'patients'));
    setPatientCount(snapPatients.size);
  };

  const handleLogout = () => {
    auth.signOut().then(() => router.push('/admin/login'));
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading System...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-xl font-headline font-bold text-primary">Dhanwanthri Clinical Portal</Link>
          <nav className="hidden md:flex gap-6 ml-12">
            <Link href="/admin/patients" className="text-sm font-bold text-foreground/60 hover:text-primary">Patients</Link>
            <Link href="/admin/appointments" className="text-sm font-bold text-foreground/60 hover:text-primary">Appointments</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-foreground/40 font-bold uppercase">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive"><LogOut className="h-5 w-5" /></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="bg-primary rounded-2xl px-8 shadow-lg shadow-primary/20">
            <Link href="/admin/patients/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Register New Patient
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 border-primary/20 text-primary">
            <Link href="/admin/appointments">
              <Calendar className="mr-2 h-5 w-5" /> Manage Online Bookings
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase">Total Registry</p>
                <p className="text-2xl font-bold text-primary">{patientCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase">Pending Bookings</p>
                <p className="text-2xl font-bold text-primary">{appointments.filter(a => a.status === 'pending').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase">Visits (Month)</p>
                <p className="text-2xl font-bold text-primary">--</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase">Clinic Capacity</p>
                <p className="text-2xl font-bold text-primary">12 Rooms</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Online Appointments */}
          <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-6">
              <CardTitle className="font-headline flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Recent Online Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {appointments.length > 0 ? appointments.map((apt) => (
                  <div key={apt.id} className="p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-bold text-primary">{apt.name}</p>
                      <p className="text-sm text-foreground/60">{apt.service} • {apt.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground/40 flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" /> {apt.createdAt?.seconds ? new Date(apt.createdAt.seconds * 1000).toLocaleDateString() : 'New'}
                      </p>
                      <Button asChild variant="ghost" size="sm" className="text-accent mt-1">
                        <Link href="/admin/appointments">Process Booking</Link>
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-foreground/40 italic">No new appointments found</div>
                )}
              </div>
              <div className="p-4 bg-muted/20 text-center">
                <Link href="/admin/appointments" className="text-sm font-bold text-primary flex items-center justify-center gap-2">
                  See All Bookings <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Find */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-accent text-accent-foreground p-8">
              <h3 className="text-xl font-headline font-bold mb-4">Patient Registry</h3>
              <p className="text-sm opacity-80 mb-6">Instantly retrieve clinical history by mobile number.</p>
              <div className="space-y-4">
                <Input placeholder="Search name / mobile..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12" />
                <Button asChild className="w-full bg-white text-accent hover:bg-white/90 h-12 rounded-xl font-bold">
                  <Link href="/admin/patients">Open Search</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
