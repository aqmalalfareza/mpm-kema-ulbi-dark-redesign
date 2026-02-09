import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/DashboardShared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Aspiration, AspirationStatus, UserRole, LegislativeDocument, StructureMember, SupervisionActivity } from '@shared/types';
import { format } from 'date-fns';
import {
  Search, Filter, ExternalLink, Inbox,
  CheckCircle, Clock, AlertCircle, FileText, Users, Activity, BarChart3, Download, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
export default function MPMDashboard() {
  const [data, setData] = useState<Aspiration[]>([]);
  const [legislativeDocs, setLegislativeDocs] = useState<LegislativeDocument[]>([]);
  const [structureMembers, setStructureMembers] = useState<StructureMember[]>([]);
  const [supervisionLogs, setSupervisionLogs] = useState<SupervisionActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsp, setSelectedAsp] = useState<Aspiration | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const fetchAspirations = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      setData(res.items || []);
    } catch (err) {
      console.error("Gagal sync data", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };
  const fetchOrgData = async () => {
    try {
      const [legRes, structRes, supRes] = await Promise.all([
        api<LegislativeDocument[]>('/api/legislative'),
        api<StructureMember[]>('/api/structure'),
        api<SupervisionActivity[]>('/api/supervision')
      ]);
      setLegislativeDocs(legRes);
      setStructureMembers(structRes);
      setSupervisionLogs(supRes);
    } catch (err) {
      console.error("Gagal mengambil data organisasi", err);
    }
  };
  useEffect(() => {
    fetchAspirations(true);
    fetchOrgData();
    const interval = setInterval(() => {
      fetchAspirations(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const exportToCSV = () => {
    const headers = ['Tracking ID', 'Subject', 'Category', 'Status', 'Name', 'Email', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.trackingId,
        `"${item.subject.replace(/"/g, '""')}"`,
        item.category,
        item.status,
        `"${item.name.replace(/"/g, '""')}"`,
        item.email,
        format(new Date(item.createdAt), 'dd/MM/yyyy')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `aspirasi-mpm-${format(new Date(), 'yyyyMMdd-HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAsp) return;
    const formData = new FormData(e.currentTarget);
    const updates = {
      status: formData.get('status') as AspirationStatus,
      assignedTo: formData.get('assignedTo') as UserRole,
      internalNotes: formData.get('internalNotes') as string,
    };
    try {
      await api(`/api/aspirations/${selectedAsp.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      toast.success(`Status berhasil disimpan. Mock email dikirim ke ${selectedAsp?.email} dengan status baru: ${updates.status}`);
      setIsUpdateOpen(false);
      fetchAspirations(false);
    } catch (err) {
      toast.error("Gagal update status");
    }
  };
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: "secondary",
      REVIEW: "outline",
      DIPROSES: "default",
      SELESAI: "success"
    };
    return <Badge variant={variants[status] as any || "default"} className="px-2 py-0 text-[10px]">{status}</Badge>;
  };
  return (
    <AppLayout contentClassName="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white mb-2">Command <span className="text-brand-gold italic">Center</span></h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Otoritas Legislatif MPM KEMA ULBI</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white/60 hover:text-brand-gold font-bold uppercase tracking-widest text-[10px] h-12 px-6">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button onClick={() => fetchAspirations(true)} className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-glow">
              <Activity className="w-4 h-4 mr-2" /> Sync Data
            </Button>
            <Button onClick={exportToCSV} className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-glow">
              <Download className="w-4 h-4 mr-2" /> CSV Export
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Aspirasi" value={data.length} icon={Inbox} trend={{ value: "+8%", positive: true }} />
          <StatCard label="Proses Review" value={data.filter(a => a.status === 'REVIEW').length} icon={AlertCircle} />
          <StatCard label="Dalam Penanganan" value={data.filter(a => a.status === 'DIPROSES').length} icon={Clock} />
          <StatCard label="Kasus Selesai" value={data.filter(a => a.status === 'SELESAI').length} icon={CheckCircle} />
        </div>
        <Tabs defaultValue="aspirasi" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl mb-8 overflow-x-auto">
            <TabsTrigger value="aspirasi" className="rounded-xl data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black font-bold text-xs uppercase tracking-widest px-8">Aspirasi</TabsTrigger>
            <TabsTrigger value="legislatif" className="rounded-xl data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black font-bold text-xs uppercase tracking-widest px-8">Legislatif</TabsTrigger>
            <TabsTrigger value="struktur" className="rounded-xl data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black font-bold text-xs uppercase tracking-widest px-8">Struktur</TabsTrigger>
            <TabsTrigger value="pengawasan" className="rounded-xl data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black font-bold text-xs uppercase tracking-widest px-8">Pengawasan</TabsTrigger>
          </TabsList>
          <TabsContent value="aspirasi">
            <Card className="glass-card border-white/5 bg-brand-dark/40 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-black text-white">Log Aspirasi Terbaru</h3>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Manajemen antrian aspirasi masuk</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input placeholder="CARI TRACKING ID..." className="bg-white/5 border-white/10 pl-10 h-11 text-[10px] font-bold tracking-widest uppercase focus:border-brand-gold text-white" />
                </div>
              </div>
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 py-6">ID Tracking</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 py-6">Perihal</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 py-6">Kategori</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 py-6">Status</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/30 py-6 pr-8">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-24 text-white/20 font-black uppercase tracking-widest">Sinkronisasi Database...</TableCell></TableRow>
                  ) : data.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-24 text-white/20 font-black uppercase tracking-widest">Belum ada aspirasi masuk.</TableCell></TableRow>
                  ) : data.map((item) => (
                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-mono font-bold text-xs text-brand-gold py-6">{item.trackingId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm tracking-tight mb-1">{item.subject}</span>
                          <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{format(item.createdAt, 'dd MMM yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="border-white/10 text-white/40 text-[9px] uppercase tracking-widest">{item.category}</Badge></TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedAsp(item); setIsUpdateOpen(true); }} className="hover:bg-brand-gold/10 text-white/20 hover:text-brand-gold">
                          <ExternalLink className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="legislatif">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {legislativeDocs.map(doc => (
                <Card key={doc.id} className="glass-card border-white/5 bg-brand-dark/40 hover-lift overflow-hidden group">
                  <div className="h-1 bg-brand-gold w-0 group-hover:w-full transition-all duration-500" />
                  <CardHeader>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-2">{doc.category}</p>
                    <CardTitle className="text-xl font-serif font-black text-white">{doc.title}</CardTitle>
                    <CardDescription className="text-white/30 text-xs">Diperbarui: {format(doc.updatedAt, 'dd MMM yyyy')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/50 leading-relaxed mb-6 italic">Dokumen hukum resmi yang mengatur tata kelola organisasi kemahasiswaan ULBI.</p>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-brand-gold hover:text-brand-black transition-all font-bold uppercase tracking-widest text-[10px]" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" /> Buka Dokumen
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="struktur">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {structureMembers.map(member => (
                <div key={member.id} className="group relative flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-brand-gold/20 scale-110 group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-full overflow-hidden bg-white/5 border border-white/10">
                      <img 
                        src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} 
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-center text-sm">{member.name}</h4>
                  <p className="text-[10px] text-brand-gold uppercase font-black tracking-widest mt-1 text-center">{member.position}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pengawasan">
            <div className="space-y-6">
              {supervisionLogs.map(log => (
                <Card key={log.id} className="glass-card border-none bg-brand-dark/40 overflow-hidden">
                  <div className="flex items-center gap-6 p-6">
                    <div className="h-16 w-16 bg-brand-gold/10 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-brand-gold/20">
                      <span className="text-[10px] font-black text-brand-gold uppercase">{format(log.date, 'MMM')}</span>
                      <span className="text-2xl font-serif font-black text-white">{format(log.date, 'dd')}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{log.title}</h4>
                      <p className="text-sm text-white/40 leading-relaxed">{log.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-brand-gold">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {/* Update Workflow Modal */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent className="sm:max-w-lg bg-brand-dark border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif font-black text-2xl">Moderasi Aspirasi</DialogTitle>
              <DialogDescription className="text-white/40">Tinjau detail dan tentukan alur tindak lanjut strategis.</DialogDescription>
            </DialogHeader>
            {selectedAsp && (
              <form onSubmit={handleUpdate} className="space-y-6 py-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">{selectedAsp.trackingId}</p>
                  <p className="font-bold text-lg mb-3 tracking-tight">{selectedAsp.subject}</p>
                  <p className="text-sm text-white/50 italic leading-relaxed">"{selectedAsp.description}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Status Workflow</Label>
                    <Select name="status" defaultValue={selectedAsp.status}>
                      <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-brand-dark border-white/10 text-white">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEW">Review MPM</SelectItem>
                        <SelectItem value="DIPROSES">Diproses Pihak Kampus</SelectItem>
                        <SelectItem value="SELESAI">Selesai (Tutup Case)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tugaskan Ke</Label>
                    <Select name="assignedTo" defaultValue={selectedAsp.assignedTo || 'MPM'}>
                      <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-brand-dark border-white/10 text-white">
                        <SelectItem value="MPM">MPM (Legislatif)</SelectItem>
                        <SelectItem value="KEMAHASISWAAN">Kemahasiswaan</SelectItem>
                        <SelectItem value="BEM">BEM (Eksekutif)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Catatan Koordinasi Intern</Label>
                  <Textarea name="internalNotes" placeholder="Hanya terlihat oleh jajaran pimpinan..." className="bg-white/5 border-white/10 min-h-[100px] resize-none focus:border-brand-gold" defaultValue={selectedAsp.internalNotes} />
                </div>
                <DialogFooter className="pt-4 gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsUpdateOpen(false)} className="text-white/40 hover:text-white uppercase font-bold text-[10px] tracking-widest">Batal</Button>
                  <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-black uppercase tracking-widest text-[10px] px-8 shadow-glow h-12">Simpan Perubahan</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}