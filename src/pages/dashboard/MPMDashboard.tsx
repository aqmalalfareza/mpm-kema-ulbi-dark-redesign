import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Aspiration } from '@shared/types';
import { format } from 'date-fns';
import { Search, Filter, MessageSquare, ExternalLink } from 'lucide-react';
export default function MPMDashboard() {
  const [data, setData] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const res = await api<{items: Aspiration[]}>('/api/aspirations');
        setData(res.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAspirations();
  }, []);
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: "secondary",
      REVIEW: "outline",
      DIPROSES: "default",
      SELESAI: "success"
    };
    return <Badge variant={variants[status] as any || "default"}>{status}</Badge>;
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pusat Aspirasi</h1>
            <p className="text-muted-foreground">Monitor dan kelola seluruh suara mahasiswa KEMA ULBI.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            <Button><Search className="w-4 h-4 mr-2" /> Cari</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Masuk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter(a => a.status === 'PENDING').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter(a => a.status === 'REVIEW').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Proses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{data.filter(a => a.status === 'DIPROSES').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Selesai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.filter(a => a.status === 'SELESAI').length}</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Subjek</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Memuat data...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Tidak ada aspirasi ditemukan.</TableCell></TableRow>
              ) : data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-bold text-xs">{item.trackingId}</TableCell>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{item.category}</Badge></TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(item.createdAt, 'dd/MM/yy')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}