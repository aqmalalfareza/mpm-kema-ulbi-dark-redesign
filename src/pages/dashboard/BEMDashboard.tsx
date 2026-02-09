import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Aspiration } from '@shared/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
export default function BEMDashboard() {
  const [proposals, setProposals] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      // Mock filtering for BEM's own proposals
      setProposals(res.items.filter(i => i.category === 'PROPOSAL'));
    } catch (e) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchProposals(); }, []);
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
      fetchProposals();
    } catch (err) {
      toast.error("Gagal mengirim proposal");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-foreground">Portal Proposal BEM</h1>
            <p className="text-muted-foreground mt-1">Ajukan dan pantau status persetujuan kegiatan legislatif.</p>
          </div>
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 mr-2" /> Ajukan Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pengajuan Proposal Baru</DialogTitle>
                <DialogDescription>Pastikan berkas fisik sudah diserahkan ke sekretariat MPM.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Judul Proposal</Label>
                  <Input name="subject" placeholder="Contoh: Dies Natalis ULBI 2024" required />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi Singkat & Estimasi Anggaran</Label>
                  <Textarea name="description" placeholder="Jelaskan tujuan kegiatan dan total dana yang diajukan..." className="min-h-[150px]" required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full">Kirim Pengajuan Resmi</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             Array(3).fill(0).map((_, i) => <Card key={i} className="h-48 animate-pulse bg-muted" />)
          ) : proposals.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">Belum ada proposal yang diajukan.</p>
            </div>
          ) : proposals.map((prop) => (
            <Card key={prop.id} className="group hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground">{prop.trackingId}</span>
                  <Badge variant={prop.status === 'SELESAI' ? 'secondary' : 'default'} className="text-[10px]">
                    {prop.status}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">{prop.subject}</CardTitle>
                <CardDescription>Diajukan: {format(prop.createdAt, 'dd/MM/yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Tahap Persetujuan</span>
                    <span>{prop.status === 'SELESAI' ? '100%' : prop.status === 'DIPROSES' ? '75%' : prop.status === 'REVIEW' ? '40%' : '10%'}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full transition-all duration-500",
                      prop.status === 'SELESAI' ? 'bg-green-500 w-full' : 
                      prop.status === 'DIPROSES' ? 'bg-primary w-[75%]' : 
                      prop.status === 'REVIEW' ? 'bg-yellow-500 w-[40%]' : 'bg-muted-foreground/30 w-[10%]'
                    )} />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <Clock className="w-4 h-4" />
                    <span>Ditinjau</span>
                  </div>
                  <div className="flex-1 h-px bg-muted" />
                  <div className={cn("flex flex-col items-center gap-1", prop.status === 'SELESAI' ? "text-green-600" : "opacity-30")}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Disetujui</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm">Informasi Penting Legislatif</CardTitle>
                <CardDescription className="text-xs">Update terakhir kebijakan MPM: 01 Jan 2024</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Sesuai AD/ART KEMA ULBI, setiap pengajuan anggaran organisasi wajib melalui sistem monitoring MPM untuk transparansi penggunaan dana kemahasiswaan. Mohon pastikan deskripsi proposal mencakup rincian manfaat bagi mahasiswa.
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}