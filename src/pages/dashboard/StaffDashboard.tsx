import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/DashboardShared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import type { Aspiration } from '@shared/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Megaphone, CheckCircle, Clock, MessageSquare, Send, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/auth-store';
import { format } from 'date-fns';
export default function StaffDashboard() {
  const [data, setData] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyFileUrl, setReplyFileUrl] = useState('');
  const user = useAuthStore(s => s.user);
  const fetchTasks = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      const filtered = res.items.filter(a => a.assignedTo === 'KEMAHASISWAAN' || a.status === 'DIPROSES');
      setData(filtered);
    } catch (err) {
      console.error("Gagal memuat tugas", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReplyFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    fetchTasks(true);
    const interval = setInterval(() => {
      fetchTasks(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const handlePostReply = async (id: string) => {
    if (!replyText.trim() || !user) return;
    setSubmitting(true);
    try {
      await api(`/api/aspirations/${id}/responses`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyText,
          authorRole: user.role,
          authorName: user.name,
          fileUrl: replyFileUrl || undefined
        }),
      });
      await api(`/api/aspirations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SELESAI' }),
      });
      toast.success('Tanggapan berhasil dipublikasikan & SELESAI. Mock email konfirmasi dikirim ke pemilik aspirasi.');
      setReplyText('');
      setReplyId(null);
      setReplyFileUrl('');
      fetchTasks(false);
    } catch (err) {
      toast.error("Gagal mengirim tanggapan");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AppLayout contentClassName="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white mb-2">Workspace <span className="text-brand-gold italic">Kemahasiswaan</span></h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Portal Tanggapan Resmi Kampus</p>
          </div>
          <div className="bg-brand-gold/10 text-brand-gold px-6 py-3 rounded-2xl border border-brand-gold/20 flex items-center gap-3 font-black uppercase tracking-widest text-[10px] animate-pulse shadow-glow">
            <Megaphone className="w-5 h-5" />
            {data.filter(a => a.status !== 'SELESAI').length} Antrian Tugas
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Tugas Aktif" value={data.filter(a => a.status !== 'SELESAI').length} icon={Clock} />
          <StatCard label="Tuntas Diproses" value={data.filter(a => a.status === 'SELESAI').length} icon={CheckCircle} />
          <StatCard label="Response Time" value="4.2 Jam" icon={BarChart3} trend={{ value: "-15%", positive: true }} />
          <StatCard label="Kategori Populer" value="Fasilitas" icon={PieChart} />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-black text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-brand-gold" /> Daftar Antrian
            </h2>
          </div>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="glass-card p-8 bg-white/5 border-white/10"><Skeleton className="h-24 w-full bg-white/5" /></Card>
            ))
          ) : data.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-32 text-center glass-card border-dashed border-white/10 bg-transparent">
              <CheckCircle className="w-16 h-16 text-brand-gold opacity-20 mb-6" />
              <h3 className="text-2xl font-serif font-black text-white">Inbox Kosong</h3>
              <p className="text-white/40 mt-2 max-w-sm">Semua aspirasi telah ditindaklanjuti dengan baik.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {data.map((item) => (
                <Card key={item.id} className={cn(
                  "glass-card border-none bg-brand-dark/40 overflow-hidden transition-all group",
                  item.status === 'SELESAI' ? "opacity-60" : "shadow-glow-sm"
                )}>
                  <div className={cn("h-1.5 w-full", item.status === 'SELESAI' ? "bg-white/10" : "bg-brand-gold")} />
                  <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-black text-brand-gold uppercase tracking-widest">{item.trackingId}</span>
                        <Badge variant="outline" className="border-white/10 text-white/30 text-[9px] uppercase tracking-widest">{item.category}</Badge>
                      </div>
                      <CardTitle className="text-2xl font-serif font-black text-white tracking-tight">{item.subject}</CardTitle>
                      <CardDescription className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Diterima: {format(item.createdAt, 'dd MMMM yyyy HH:mm')}</CardDescription>
                    </div>
                    <Badge className={cn("px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest", item.status === 'SELESAI' ? "bg-white/10 text-white/40" : "bg-brand-gold text-brand-black")}>{item.status}</Badge>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-sm text-white/70 italic leading-relaxed">
                      "{item.description}"
                    </div>
                    {item.internalNotes && (
                      <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-xl flex gap-3 text-xs text-brand-gold/80 leading-relaxed">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div><strong className="uppercase font-black tracking-widest text-[9px]">Instruksi MPM:</strong><br />{item.internalNotes}</div>
                      </div>
                    )}
                    {replyId === item.id ? (
                      <div className="space-y-4 pt-4 animate-fade-in">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tulis Tanggapan Resmi</Label>
                        <Textarea
                          placeholder="Berikan jawaban definitif dari pihak Rektorat/Kemahasiswaan..."
                          className="min-h-[160px] bg-white/5 border-white/10 text-white focus:border-brand-gold resize-none"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Lampiran (Opsional)</Label>
                          <input
                            type="file"
                            accept="*/*"
                            onChange={handleFileSelect}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-brand-gold file:text-brand-black hover:file:bg-brand-gold/90"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-glow"
                            onClick={() => handlePostReply(item.id)}
                            disabled={submitting}
                          >
                            {submitting ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                            Publikasikan Jawaban
                          </Button>
                          <Button variant="ghost" onClick={() => {
                            setReplyId(null);
                            setReplyFileUrl('');
                          }} className="text-white/40 uppercase font-bold text-[10px] tracking-widest h-12 px-8">Batal</Button>
                        </div>
                      </div>
                    ) : (
                      item.status !== 'SELESAI' && (
                        <Button
                          className="w-full md:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-brand-gold font-black uppercase tracking-widest text-[10px] px-8 h-14"
                          onClick={() => setReplyId(item.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" /> Selesaikan & Kirim Respon
                        </Button>
                      )
                    )}
                    {item.responses && item.responses.length > 0 && (
                      <div className="pt-8 border-t border-white/5 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Riwayat Komunikasi Resmi</p>
                        {item.responses.map(res => (
                          <div key={res.id} className="p-4 bg-white/5 rounded-xl text-xs flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-brand-gold uppercase tracking-widest text-[9px]">{res.authorName}</span>
                              <span className="text-[10px] text-white/20 font-mono">{format(res.timestamp, 'dd/MM/yy HH:mm')}</span>
                            </div>
                            <p className="text-white/60 leading-relaxed">{res.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}