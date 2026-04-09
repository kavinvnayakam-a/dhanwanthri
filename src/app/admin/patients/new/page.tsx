
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    sex: 'Male',
    address: '',
    branch: 'Ashok Nagar',
    regNo: `REG-${Date.now().toString().slice(-6)}`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      router.push(`/admin/patients/${docRef.id}`);
    } catch (error) {
      console.error(error);
      alert('Error creating record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full text-foreground/60">
            <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-accent" />
              <div>
                <CardTitle className="text-2xl font-headline">Register New Patient</CardTitle>
                <CardDescription className="text-primary-foreground/70">Create a permanent medical profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Registration No. (Auto)</label>
                <Input value={formData.regNo} readOnly className="bg-muted border-none font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Branch</label>
                <Input value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="border-primary/10" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-primary">Full Name *</label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Mr./Mrs. Patient Name" className="border-primary/10 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Contact Number *</label>
                <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Email Address</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="patient@example.com" className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Date of Birth</label>
                <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="border-primary/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Sex</label>
                <select 
                  className="w-full h-10 rounded-md border border-primary/10 bg-white px-3"
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-primary">Communication Address</label>
                <textarea 
                  className="w-full min-h-[100px] rounded-md border border-primary/10 bg-white p-3 text-sm"
                  placeholder="Street, City, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="sm:col-span-2 pt-4">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-bold text-lg" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Profile & Proceed'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
