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
import { Search, CheckCircle2, Circle, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
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
  const handleSearch = async () => {
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
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setData(null);
      setTrackingId('');
    }
  };
  const currentStageIndex = data ? STAGES.findIndex(s => s.value === data.status) : -1;
  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full px-8 py-6 border-2 font-semibold hover:bg-secondary/5">
          Cek Status Aspirasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Lacak Progres Aspirasi</DialogTitle>
          <DialogDescription>Masukkan kode tracking unik Anda untuk melihat perkembangan terbaru.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Contoh: ASP-123456"
            className="uppercase font-mono text-lg py-6"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} className="px-6">
            {loading ? <Clock className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>
        {data && (
          <div className="mt-8 space-y-8 animate-fade-in">
            <div className="p-5 bg-primary/5 rounded-xl border-l-4 border-l-primary shadow-sm">
              <h3 className="font-bold text-xl mb-1 text-primary">{data.subject}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {data.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(data.createdAt, 'dd MMM yyyy')}</span>
              </div>
            </div>
            <div className="space-y-1">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage.value} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                        isCompleted ? "bg-primary border-primary text-white" : "bg-background border-muted text-muted"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-muted" />}
                      </div>
                      {idx !== STAGES.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-12 transition-colors",
                          idx < currentStageIndex ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={cn(
                        "font-bold text-lg",
                        isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>{stage.label}</p>
                      {isCurrent && (
                        <p className="text-sm text-muted-foreground mt-0.5 italic">Tim kami sedang menangani tahap ini.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {data.responses && data.responses.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-display font-bold text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Tanggapan Resmi
                </h4>
                <div className="space-y-4">
                  {data.responses.map(res => (
                    <div key={res.id} className="p-4 bg-muted/40 rounded-xl border text-sm relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-primary uppercase text-xs tracking-wider">{res.authorRole}</p>
                          <p className="text-[10px] text-muted-foreground">{res.authorName}</p>
                        </div>
                        <span className="text-[10px] font-mono bg-background px-2 py-0.5 rounded border">{format(res.timestamp, 'dd/MM/yy HH:mm')}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line text-foreground/90">{res.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}