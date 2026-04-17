"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, ArrowLeft, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [existingFamily, setExistingFamily] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    age: '',
    sex: 'Male',
    type: 'Out-patient',
    address: '',
    branch: 'Ashok Nagar',
    regNo: `REG-${Date.now().toString().slice(-6)}`,
    status: 'admitted'
  });

  useEffect(() => {
    const nameParam = searchParams.get('name');
    const phoneParam = searchParams.get('phone');
    const emailParam = searchParams.get('email');
    
    if (nameParam || phoneParam || emailParam) {
      const p = phoneParam || '';
      setFormData(prev => ({
        ...prev,
        name: nameParam || prev.name,
        phone: p,
        email: emailParam || prev.email
      }));
      if (p) checkPhoneExistence(p);
    }
  }, [searchParams]);

  const checkPhoneExistence = async (phone: string) => {
    if (phone.length < 10 || !db) return;
    setCheckingPhone(true);
    try {
      const q = query(collection(db, 'patients'), where('phone', '==', phone));
      const snap = await getDocs(q);
      setExistingFamily(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingPhone(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'patients'), {
        ...formData,
        createdAt: serverTimestamp(),
        lastVisit: new Date().toISOString().split('T')[0]
      });
      router.push(`/admin/dashboard`);
    } catch (error) {
      console.error(error);
      alert('Error creating record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="rounded-full text-foreground/60 h-10">
          <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Back to Dashboard</span><span className="sm:hidden">Dashboard</span></Link>
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-primary text-primary-foreground p-6 md:p-8">
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-accent shrink-0" />
            <div>
              <CardTitle className="text-xl md:text-2xl font-headline">Receptionist Enrollment</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-xs md:sm">New patient registration and intake</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          {existingFamily.length > 0 && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl">
              <Users className="h-5 w-5" />
              <AlertTitle className="font-bold">Existing Family Records Found</AlertTitle>
              <AlertDescription className="text-sm">
                This mobile number ({formData.phone}) is already linked to: 
                <span className="font-bold ml-1">{existingFamily.map(f => f.name).join(', ')}</span>. 
                Registering will create a new family profile under this contact.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Registration No. (Auto)</label>
              <Input value={formData.regNo} readOnly className="bg-muted border-none font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Mobile Number *</label>
              <div className="relative">
                <Input 
                  required 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (e.target.value.length >= 10) checkPhoneExistence(e.target.value);
                  }} 
                  placeholder="+91 XXXXX XXXXX" 
                  className="border-primary/10 h-12 pr-10" 
                />
                {checkingPhone && <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-primary/40" />}
              </div>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-primary">Patient Name *</label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full name of the patient" className="border-primary/10 h-12" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Email (Optional)</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="patient@example.com" className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Date of Birth</label>
                <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="border-primary/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Age</label>
                <Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Sex</label>
                <select className="w-full h-10 rounded-md border border-primary/10 bg-white px-3 text-sm" value={formData.sex} onChange={(e) => setFormData({...formData, sex: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Visit Type</label>
                <select className="w-full h-10 rounded-md border border-primary/10 bg-white px-3 text-sm" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option>Out-patient</option>
                  <option>In-patient</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-primary">Communication Address</label>
              <textarea 
                className="w-full min-h-[80px] rounded-md border border-primary/10 bg-white p-3 text-sm"
                placeholder="Street, City, Area Code"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="sm:col-span-2 pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-bold text-lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Check-in Patient at Reception'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewPatientPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Suspense fallback={<div className="p-20 text-center font-bold text-primary">Loading enrollment...</div>}>
        <RegistrationForm />
      </Suspense>
    </div>
  );
}
