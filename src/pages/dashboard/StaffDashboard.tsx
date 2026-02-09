import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, CheckCircle, Clock } from 'lucide-react';
export default function StaffDashboard() {
  return (
    <AppLayout container>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Tugas Kemahasiswaan</h1>
          <p className="text-muted-foreground">Kelola dan berikan tanggapan resmi terhadap aspirasi yang diteruskan MPM.</p>
        </header>
        <div className="grid gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle>Perbaikan Lampu Taman Kampus</CardTitle>
                <CardDescription>Diteruskan oleh: MPM (Legislatif)</CardDescription>
              </div>
              <Badge variant="outline">DIPROSES</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">"Mahasiswa mengeluhkan kondisi penerangan di area taman belakang gedung rektorat yang gelap saat malam hari."</p>
              <div className="flex gap-2">
                <Button size="sm">Berikan Tanggapan</Button>
                <Button variant="ghost" size="sm">Tandai Selesai</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="opacity-60 bg-muted/20">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle>Sistem Portal Akademik Lambat</CardTitle>
                <CardDescription>Diteruskan oleh: MPM (Legislatif)</CardDescription>
              </div>
              <Badge variant="secondary">SELESAI</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Tanggapan: "Server telah ditingkatkan kapasitasnya per tanggal 15 Feb."</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}