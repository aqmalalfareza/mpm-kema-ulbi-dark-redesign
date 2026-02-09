import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Search, CheckCircle2, Circle, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Aspiration, AspirationStatus } from '@shared/types';
import { format } from 'date-fns';
const STAGES: { label: string; value: AspirationStatus }[] = [
  { label: 'Terkirim', value: 'PENDING' },
  { label: 'Ditinjau MPM', value: 'REVIEW' },
  { label: 'Diproses Kampus', value: 'DIPROSES' },
  { label: 'Selesai', value: 'SELESAI' },
];
export function StatusCheck() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Aspiration | null>(null);
  async function handleSearch() {
    if (!trackingId.trim()) return;
    setLoading(true);
    try {
      const result = await api<Aspiration>(`/api/aspirations/track/${trackingId.toUpperCase()}`);
      setData(result);
    } catch (e) {
      toast.error("ID Tracking tidak ditemukan");
      setData(null);
    } finally {
      setLoading(false);
    }
  }
  const currentStageIndex = data ? STAGES.findIndex(s => s.value === data.status) : -1;
  return (
    <Dialog onOpenChange={(v) => { if(!v) { setData(null); setTrackingId(''); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full px-8 py-6 border-2">
          Cek Status Aspirasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Lacak Aspirasi</DialogTitle>
          <DialogDescription>Masukkan kode tracking yang Anda dapatkan saat mengirim aspirasi.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Input 
            placeholder="Contoh: ASP-123456" 
            className="uppercase font-mono text-lg"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Clock className="animate-spin" /> : <Search />}
          </Button>
        </div>
        {data && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="p-4 bg-accent/50 rounded-lg border">
              <h3 className="font-bold text-lg mb-1">{data.subject}</h3>
              <p className="text-sm text-muted-foreground">Kategori: <span className="text-foreground font-medium">{data.category}</span></p>
              <p className="text-sm text-muted-foreground">Tanggal: {format(data.createdAt, 'dd MMM yyyy, HH:mm')}</p>
            </div>
            <div className="relative space-y-4">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage.value} className="flex gap-4 relative">
                    {idx !== STAGES.length - 1 && (
                      <div className={cn(
                        "absolute left-3 top-6 w-0.5 h-full",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                    <div className={cn(
                      "z-10 w-6 h-6 rounded-full flex items-center justify-center bg-background border-2",
                      isCompleted ? "border-primary text-primary" : "border-muted text-muted"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 fill-primary text-white" /> : <Circle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={cn(
                        "font-semibold",
                        isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>{stage.label}</p>
                      {isCurrent && (
                        <p className="text-xs text-muted-foreground">Sedang dalam tahap ini...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {data.responses && data.responses.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Tanggapan Resmi
                </h4>
                {data.responses.map(res => (
                  <div key={res.id} className="p-3 bg-muted rounded border-l-4 border-primary text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs uppercase">{res.authorRole}</span>
                      <span className="text-2xs text-muted-foreground">{format(res.timestamp, 'dd/MM/yy HH:mm')}</span>
                    </div>
                    <p>{res.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}