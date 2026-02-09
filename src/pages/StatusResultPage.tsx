import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Aspiration, AspirationStatus } from '@shared/types';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Download,
  ChevronLeft,
  ArrowRight,
  Circle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
const STAGES: { label: string; value: AspirationStatus }[] = [
  { label: 'Aspirasi Terkirim', value: 'PENDING' },
  { label: 'Ditinjau Legislatif', value: 'REVIEW' },
  { label: 'Tindak Lanjut Kampus', value: 'DIPROSES' },
  { label: 'Selesai & Arsip', value: 'SELESAI' },
];
export default function StatusResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Aspiration | null>(null);
  const [loading, setLoading] = useState(true);
  const lastStatusRef = useRef<AspirationStatus | null>(null);
  const fetchStatus = useCallback(async (showLoading = false) => {
    if (!id) return;
    if (showLoading) setLoading(true);
    try {
      const res = await api<Aspiration>(`/api/aspirations/track/${id.toUpperCase()}`);
      if (lastStatusRef.current && lastStatusRef.current !== res.status) {
        toast.info(`Status aspirasi Anda telah diperbarui menjadi: ${res.status}`);
      }
      lastStatusRef.current = res.status;
      setData(res);
    } catch (err) {
      console.error("Gagal refresh status", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchStatus(true);
      const interval = setInterval(() => {
        fetchStatus(false);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [id, fetchStatus]);
  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!data) return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-serif font-bold text-white mb-4">Data Tidak Ditemukan</h1>
      <p className="text-white/50 mb-8">Tracking ID {id} tidak valid atau telah kadaluarsa.</p>
      <Link to="/"><Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">Kembali ke Beranda</Button></Link>
    </div>
  );
  const currentIdx = STAGES.findIndex(s => s.value === data.status);
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-gold selection:text-brand-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </Link>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-widest rounded">Aspirasi</span>
              <span className="font-mono text-sm text-white/40">{data.trackingId}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black">{data.subject}</h1>
          </div>
          <Badge className="bg-brand-gold text-brand-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest h-fit shadow-glow">
            {data.status}
          </Badge>
        </header>
        <div className="grid md:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="md:col-span-1 space-y-10">
            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-8">Alur Progres</h3>
            <div className="space-y-0">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage.value} className="relative flex gap-6 pb-10">
                    {idx !== STAGES.length - 1 && (
                      <div className={cn("absolute left-[15px] top-8 w-px h-full", isCompleted ? "bg-brand-gold" : "bg-white/10")} />
                    )}
                    <div className={cn(
                      "z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isCompleted ? "bg-brand-gold border-brand-gold text-brand-black" : "bg-brand-black border-white/20 text-white/20"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-2 h-2 fill-current" />}
                    </div>
                    <div className="pt-1">
                      <p className={cn("text-sm font-bold", isCurrent ? "text-brand-gold" : isCompleted ? "text-white" : "text-white/30")}>
                        {stage.label}
                      </p>
                      {isCurrent && <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Tahap Aktif</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Details & Responses */}
          <div className="md:col-span-2 space-y-8">
            <Card className="glass-card border-none bg-white/5">
              <CardHeader><CardTitle className="text-xs font-black text-brand-gold uppercase tracking-[0.2em]">Detail Pengirim</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/30 mb-1 uppercase text-[10px] font-black tracking-widest">Nama</p>
                    <p className="font-bold">{data.name}</p>
                  </div>
                  <div>
                    <p className="text-white/30 mb-1 uppercase text-[10px] font-black tracking-widest">Kategori</p>
                    <p className="font-bold">{data.category}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 text-sm leading-relaxed text-white/70 italic">
                  "{data.description}"
                </div>
              </CardContent>
            </Card>
            {data.responses && data.responses.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Tanggapan Resmi</h3>
                {data.responses.map(res => (
                  <Card key={res.id} className="glass-card border-none bg-brand-gold/5 overflow-hidden">
                    <div className="h-1 w-full bg-brand-gold" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">{res.authorRole}</p>
                        <CardTitle className="text-sm font-bold">{res.authorName}</CardTitle>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{format(res.timestamp, 'dd MMM yyyy HH:mm')}</span>
                    </CardHeader>
                    <CardContent className="text-sm leading-relaxed text-white/80">
                      {res.content}
                      {res.fileUrl && (
                        <Button variant="outline" size="sm" className="w-full mt-4 border-white/10 text-xs gap-2">
                          <Download className="w-3 h-3" /> Unduh Lampiran
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {data.status === 'SELESAI' && (
              <div className="p-8 rounded-2xl bg-brand-gold text-brand-black text-center space-y-4 shadow-glow">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="text-2xl font-serif font-black">Aspirasi Tuntas</h4>
                <p className="text-sm font-medium opacity-80">Terima kasih telah berkontribusi untuk KEMA ULBI yang lebih baik.</p>
                <Button className="bg-brand-black text-white hover:bg-brand-black/90 w-full mt-4 font-black uppercase tracking-widest text-[10px] h-12">Unduh Laporan Akhir</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}