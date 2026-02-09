import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/DashboardShared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Aspiration, AspirationStatus, UserRole } from '@shared/types';
import { format } from 'date-fns';
import { 
  Search, Filter, MessageSquare, ExternalLink, Inbox, 
  CheckCircle, Clock, AlertCircle, BarChart3, PieChart
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth-store';
export default function MPMDashboard() {
  const [data, setData] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsp, setSelectedAsp] = useState<Aspiration | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const user = useAuthStore(s => s.user);
  const fetchAspirations = async () => {
    setLoading(true);
    try {
      const res = await api<{items: Aspiration[]}>('/api/aspirations');
      setData(res.items);
    } catch (err) {
      toast.error("Gagal mengambil data aspirasi");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAspirations();
  }, []);
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
      toast.success("Update berhasil disimpan");
      setIsUpdateOpen(false);
      fetchAspirations();
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
  const chartData = [
    { name: 'Pending', value: data.filter(a => a.status === 'PENDING').length, color: '#94a3b8' },
    { name: 'Review', value: data.filter(a => a.status === 'REVIEW').length, color: '#3b82f6' },
    { name: 'Proses', value: data.filter(a => a.status === 'DIPROSES').length, color: '#eab308' },
    { name: 'Selesai', value: data.filter(a => a.status === 'SELESAI').length, color: '#22c55e' },
  ];
  return (
    <AppLayout container>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight">Command Center</h1>
            <p className="text-muted-foreground mt-1">Lembaga Legislatif MPM KEMA ULBI — Manajemen Aspirasi.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            <Button onClick={fetchAspirations} variant="secondary"><Clock className="w-4 h-4 mr-2" /> Refresh</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Masuk" value={data.length} icon={Inbox} trend={{ value: "+12%", positive: true }} />
          <StatCard label="Dalam Review" value={data.filter(a => a.status === 'REVIEW').length} icon={AlertCircle} />
          <StatCard label="Sedang Diproses" value={data.filter(a => a.status === 'DIPROSES').length} icon={Clock} className="border-l-4 border-l-yellow-500" />
          <StatCard label="Tuntas" value={data.filter(a => a.status === 'SELESAI').length} icon={CheckCircle} className="border-l-4 border-l-green-500" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Aspirasi Terbaru</CardTitle>
                  <CardDescription>Aspirasi mahasiswa yang perlu ditindaklanjuti.</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari tracking ID..." className="pl-8 w-64 h-9" />
                </div>
              </div>
            </CardHeader>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Tracking ID</TableHead>
                  <TableHead>Subjek</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Memuat database...</TableCell></TableRow>
                ) : data.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Belum ada aspirasi yang masuk.</TableCell></TableRow>
                ) : data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-xs text-primary">{item.trackingId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium line-clamp-1">{item.subject}</span>
                        <span className="text-[10px] text-muted-foreground">{format(item.createdAt, 'dd MMM yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[9px] uppercase">{item.category}</Badge></TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedAsp(item); setIsUpdateOpen(true); }}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><PieChart className="w-4 h-4" /> Sebaran Status</CardTitle></CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </RePie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Aktivitas Mingguan</CardTitle></CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{d:'Sen', v:10}, {d:'Sel', v:25}, {d:'Rab', v:15}, {d:'Kam', v:30}, {d:'Jum', v:22}]}>
                    <XAxis dataKey="d" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="v" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Update Workflow Modal */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Kelola Aspirasi: {selectedAsp?.trackingId}</DialogTitle>
              <DialogDescription>Tinjau detail dan tentukan alur tindak lanjut.</DialogDescription>
            </DialogHeader>
            {selectedAsp && (
              <form onSubmit={handleUpdate} className="space-y-4 py-2">
                <div className="p-4 bg-muted/30 rounded-lg text-sm border">
                  <p className="font-bold mb-1">{selectedAsp.subject}</p>
                  <p className="text-muted-foreground italic">"{selectedAsp.description}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status Workflow</Label>
                    <Select name="status" defaultValue={selectedAsp.status}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEW">Review MPM</SelectItem>
                        <SelectItem value="DIPROSES">Diproses Pihak Kampus</SelectItem>
                        <SelectItem value="SELESAI">Selesai (Tutup Case)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tugaskan Ke</Label>
                    <Select name="assignedTo" defaultValue={selectedAsp.assignedTo || 'MPM'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MPM">MPM (Legislatif)</SelectItem>
                        <SelectItem value="KEMAHASISWAAN">Staff Kemahasiswaan</SelectItem>
                        <SelectItem value="BEM">BEM (Eksekutif)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Catatan Internal (Tidak Terlihat Mahasiswa)</Label>
                  <Textarea name="internalNotes" placeholder="Catatan koordinasi antar lembaga..." defaultValue={selectedAsp.internalNotes} />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsUpdateOpen(false)}>Batal</Button>
                  <Button type="submit">Simpan Perubahan</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}