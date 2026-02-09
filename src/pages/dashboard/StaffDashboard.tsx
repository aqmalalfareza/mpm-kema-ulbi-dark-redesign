import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/DashboardShared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import type { Aspiration } from '@shared/types';
import { toast } from 'sonner';
import { Megaphone, CheckCircle, Clock, MessageSquare, Send, Skeleton } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { format } from 'date-fns';
export default function StaffDashboard() {
  const [data, setData] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore(s => s.user);
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      // In a real app, backend would filter by assignment. Mock filter here:
      setData(res.items.filter(a => a.assignedTo === 'KEMAHASISWAAN' || a.status === 'DIPROSES'));
    } catch (err) {
      toast.error("Gagal memuat tugas");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const handlePostReply = async (id: string) => {
    if (!replyText.trim() || !user) return;
    setSubmitting(true);
    try {
      // 1. Post official response
      await api(`/api/aspirations/${id}/responses`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyText,
          authorRole: user.role,
          authorName: user.name
        }),
      });
      // 2. Mark as Selesai if staff choice
      await api(`/api/aspirations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SELESAI' }),
      });
      toast.success("Tanggapan resmi berhasil dipublikasikan");
      setReplyText('');
      setReplyId(null);
      fetchTasks();
    } catch (err) {
      toast.error("Gagal mengirim tanggapan");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Tugas Kemahasiswaan</h1>
            <p className="text-muted-foreground mt-1">Kelola aspirasi yang diteruskan oleh legislatif MPM.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-pulse">
            <Megaphone className="w-5 h-5" />
            {data.filter(a => a.status !== 'SELESAI').length} Tugas Aktif
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Tugas Baru" value={data.filter(a => a.status === 'PENDING' || a.status === 'REVIEW').length} icon={Clock} />
          <StatCard label="Sedang Diproses" value={data.filter(a => a.status === 'DIPROSES').length} icon={Megaphone} />
          <StatCard label="Sudah Dijawab" value={data.filter(a => a.status === 'SELESAI').length} icon={CheckCircle} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Antrian Respon
          </h2>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-6"><Skeleton className="h-24 w-full" /></Card>
            ))
          ) : data.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 border-dashed">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4 opacity-50" />
              <CardTitle>Semua Terjawab!</CardTitle>
              <CardDescription>Belum ada aspirasi baru yang ditugaskan kepada Anda.</CardDescription>
            </Card>
          ) : data.map((item) => (
            <Card key={item.id} className={cn(
              "border-l-4 transition-all hover:shadow-md",
              item.status === 'SELESAI' ? "border-l-green-500 opacity-70" : "border-l-yellow-500 shadow-sm"
            )}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{item.trackingId}</span>
                    <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{item.subject}</CardTitle>
                  <CardDescription>Masuk: {format(item.createdAt, 'dd MMM yyyy')}</CardDescription>
                </div>
                <Badge variant={item.status === 'SELESAI' ? "secondary" : "default"}>{item.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/40 rounded border text-sm italic text-foreground/80">
                  "{item.description}"
                </div>
                {item.internalNotes && (
                  <div className="p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span><strong>Catatan MPM:</strong> {item.internalNotes}</span>
                  </div>
                )}
                {replyId === item.id ? (
                  <div className="space-y-3 pt-2 animate-fade-in">
                    <Textarea 
                      placeholder="Tulis tanggapan resmi dari pihak kampus..." 
                      className="min-h-[120px] bg-background"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handlePostReply(item.id)} disabled={submitting}>
                        {submitting ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Publikasikan & Selesaikan
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setReplyId(null)}>Batal</Button>
                    </div>
                  </div>
                ) : (
                  item.status !== 'SELESAI' && (
                    <Button size="sm" onClick={() => setReplyId(item.id)} className="w-full sm:w-auto">
                      <MessageSquare className="w-4 h-4 mr-2" /> Tulis Tanggapan
                    </Button>
                  )
                )}
                {item.responses && item.responses.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Riwayat Respon:</p>
                    {item.responses.map(res => (
                      <div key={res.id} className="text-xs p-2 bg-muted/20 rounded mb-1">
                        <span className="font-bold text-primary">{res.authorName}:</span> {res.content}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}