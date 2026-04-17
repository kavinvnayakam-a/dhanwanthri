"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase is not initialized. Check your configuration.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Access denied. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="relative h-20 w-48 mx-auto mb-4">
            <Image 
              src="https://firebasestorage.googleapis.com/v0/b/dhanwanthrimaruthuvam-83c7d.firebasestorage.app/o/Logos%2FDhanwanthiri%20Logo.webp?alt=media&token=31a8ab0e-c431-4ea5-a513-324d630ebce4"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-headline font-bold text-primary">Clinical Portal</h1>
          <p className="text-foreground/60">Secure provider access for Dhanwanthri Maruthuvam</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <CardTitle className="font-headline">Staff Sign In</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm flex gap-3 items-center">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-primary/40" />
                  <Input 
                    type="email" 
                    placeholder="admin@dhanwanthrimaruthuvam.com" 
                    className="pl-10 h-12 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Security Token</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-primary/40" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-foreground/40 font-medium">
          Authorized personnel only. Sessions are monitored for clinical safety.
        </p>
      </div>
    </div>
  );
}
