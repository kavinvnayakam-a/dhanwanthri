"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  PlusCircle, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      const patientSnap = await getDoc(doc(db, 'patients', id as string));
      if (patientSnap.exists()) {
        setPatient(patientSnap.data());
        
        const q = query(collection(db, 'patients', id as string, 'assessments'), orderBy('date', 'desc'));
        const assessmentsSnap = await getDocs(q);
        setAssessments(assessmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading Record...</div>;
  if (!patient) return <div className="p-20 text-center">Patient not found</div>;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full text-foreground/60">
            <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <div className="flex gap-3">
            <Button asChild className="bg-accent rounded-2xl">
              <Link href={`/admin/patients/${id}/assessment/new`}>
                <PlusCircle className="mr-2 h-4 w-4" /> Start New Assessment
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-headline">{patient.name}</CardTitle>
                <Badge variant="outline" className="border-white/20 text-white mt-2">{patient.regNo}</Badge>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-bold">{patient.phone}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <p className="truncate">{patient.email || 'No email'}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <p>{patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'} ({patient.sex})</p>
                </div>
                <div className="flex items-start gap-4 text-sm border-t pt-6 mt-6">
                  <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <p className="text-foreground/60">{patient.address || 'No address provided'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment History */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="p-8 border-b">
                <CardTitle className="font-headline flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" /> Clinical Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {assessments.length > 0 ? (
                  <div className="divide-y">
                    {assessments.map((record) => (
                      <div key={record.id} className="p-8 flex justify-between items-center hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-primary">Assessment #{record.id.slice(-4)}</p>
                            <Badge variant="outline" className="text-[10px] uppercase">{record.ayurvedic?.dosha || 'No Dosha Set'}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-foreground/40 font-bold">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(record.date).toLocaleDateString()}</span>
                            <span>Dr. {record.doctorChief || 'Unknown'}</span>
                          </div>
                          <p className="text-sm text-foreground/60 mt-2 line-clamp-1 italic">"{record.chiefComplaints}"</p>
                        </div>
                        <Button variant="outline" className="rounded-xl border-primary/10 hover:bg-primary hover:text-white">View Full Report</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center text-foreground/40 space-y-4">
                    <p className="italic">No previous assessments found for this patient.</p>
                    <Button asChild className="bg-primary rounded-xl">
                      <Link href={`/admin/patients/${id}/assessment/new`}>Create First Assessment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
