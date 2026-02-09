import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Send } from 'lucide-react';
export default function BEMDashboard() {
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Proposal BEM</h1>
          <Button><Plus className="w-4 h-4 mr-2" /> Proposal Baru</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Pengajuan Dana Dies Natalis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status MPM</span>
                  <span className="font-bold text-yellow-600">DITINJAU</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[60%]" />
                </div>
                <Button variant="outline" size="sm" className="w-full">Lihat Detail</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}