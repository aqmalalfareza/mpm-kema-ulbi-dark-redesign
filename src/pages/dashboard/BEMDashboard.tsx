import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Send, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Aspiration } from '@shared/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
export default function BEMDashboard() {
  const [proposals, setProposals] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const fetchProposals = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      setProposals(res.items.filter(i => i.category === 'PROPOSAL'));
    } catch (e) {
      console.error("Gagal memuat data proposal", e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };
  useEffect(() => {
    fetchProposals(true);
    const interval = setInterval(() => {
      fetchProposals(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      name: "BEM KEMA ULBI",
      email: "bem@ulbi.ac.id",
      category: "PROPOSAL",
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
    };
    try {
      await api('/api/aspirations', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      toast.success("Proposal berhasil diajukan!");
      setIsNewOpen(false);
      fetchProposals(false);
    } catch (err) {
      toast.error("Gagal mengirim proposal");
    }
  };
  return (
    <AppLayout contentClassName="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white mb-2">Portal <span className="text-brand-gold italic">Eksekutif</span></h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Pengajuan & Monitoring Anggaran BEM</p>
          </div>
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl shadow-glow transition-transform hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5 mr-2" /> Ajukan Proposal Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-brand-dark border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="font-serif font-black text-3xl">Baru: Pengajuan Proposal</DialogTitle>
                <DialogDescription className="text-white/40">Sistem monitoring legislatif KEMA ULBI.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Judul Kegiatan Utama</Label>
                  <Input name="subject" placeholder="Contoh: Dies Natalis ULBI 2024" className="bg-white/5 border-white/10 text-white focus:border-brand-gold py-6" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rangkuman Program & Estimasi Anggaran (Rp)</Label>
                  <Textarea name="description" placeholder="Uraikan urgensi kegiatan dan total dana yang diajukan..." className="bg-white/5 border-white/10 text-white min-h-[180px] focus:border-brand-gold resize-none" required />
                </div>
                <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-xl text-[10px] font-bold text-brand-gold/60 uppercase tracking-widest flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Pastikan Berkas Fisik Sudah Diterima MPM.
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full py-7 bg-brand-gold text-brand-black font-black uppercase tracking-[0.2em] shadow-glow">Kirim Pengajuan Resmi</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array(3).fill(0).map((_, i) => <Card key={i} className="h-64 glass-card animate-pulse border-white/5" />)
          ) : proposals.length === 0 ? (
            <div className="col-span-full py-32 text-center glass-card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center">
              <FileText className="w-20 h-20 text-white/10 mb-8" />
              <h3 className="text-2xl font-serif font-black text-white">Belum Ada Riwayat</h3>
              <p className="text-white/40 mt-2">Gunakan tombol di atas untuk memulai pengajuan.</p>
            </div>
          ) : proposals.map((prop) => (
            <Card key={prop.id} className="glass-card border-none bg-brand-dark/40 hover-lift group overflow-hidden">
              <div className={cn(
                "h-1.5 w-full",
                prop.status === 'SELESAI' ? 'bg-green-500' :
                prop.status === 'DIPROSES' ? 'bg-brand-gold' : 'bg-white/10'
              )} />
              <CardHeader className="pb-4 p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[10px] font-black text-brand-gold uppercase tracking-widest">{prop.trackingId}</span>
                  <Badge className={cn("text-[9px] font-black uppercase tracking-widest", prop.status === 'SELESAI' ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40")}>
                    {prop.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-serif font-black text-white tracking-tight leading-snug group-hover:text-brand-gold transition-colors">{prop.subject}</CardTitle>
                <CardDescription className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-2">Dibuat: {format(prop.createdAt, 'dd/MM/yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span>Progres Persetujuan</span>
                    <span className="text-brand-gold">{prop.status === 'SELESAI' ? '100%' : prop.status === 'DIPROSES' ? '75%' : prop.status === 'REVIEW' ? '40%' : '10%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full transition-all duration-1000",
                      prop.status === 'SELESAI' ? 'bg-green-500 w-full' :
                      prop.status === 'DIPROSES' ? 'bg-brand-gold w-[75%]' :
                      prop.status === 'REVIEW' ? 'bg-brand-gold/50 w-[40%]' : 'bg-white/20 w-[10%]'
                    )} />
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <Clock className="w-5 h-5 text-white/10" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Audit</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <CheckCircle2 className={cn("w-5 h-5", prop.status === 'SELESAI' ? "text-green-500" : "text-white/10")} />
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", prop.status === 'SELESAI' ? "text-green-500" : "text-white/20")}>Cair</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-none bg-brand-gold/5 border-l-4 border-l-brand-gold rounded-3xl p-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-brand-gold rounded-2xl text-brand-black shadow-glow">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-black text-white uppercase tracking-tight mb-2">Pemberitahuan Legislatif</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-2xl font-medium italic">"Sesuai peraturan MPM No. 04/2024, setiap pengajuan proposal wajib mencantumkan Analisis Dampak Kemahasiswaan (ADK) untuk transparansi penggunaan dana publik."</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}