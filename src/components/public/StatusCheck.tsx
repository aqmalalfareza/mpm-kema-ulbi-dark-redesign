import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Search, Loader2 } from 'lucide-react';
import type { Aspiration } from '@shared/types';
export function StatusCheck() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleSearch = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    try {
      const result = await api<Aspiration>(`/api/aspirations/track/${trackingId.toUpperCase()}`);
      if (result) {
        setIsOpen(false);
        navigate(`/status/${result.trackingId}`);
      }
    } catch (e) {
      toast.error("ID Tracking tidak valid atau tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full border-white/10 hover:border-brand-gold/50 hover:bg-white/5 text-xs font-bold uppercase tracking-widest h-12 px-8">
          Pantau Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-brand-dark border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-black">Lacak Aspirasi</DialogTitle>
          <DialogDescription className="text-white/50">Masukkan kode tracking unik untuk melihat progres tindak lanjut.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-6">
          <Input
            placeholder="CONTOH: ASP-20240101-0001"
            className="uppercase font-mono text-lg py-7 bg-white/5 border-white/10 focus:border-brand-gold transition-colors text-center tracking-widest"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch} 
            disabled={loading} 
            className="w-full bg-brand-gold text-brand-black font-black uppercase tracking-widest py-7"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Search className="mr-2 h-5 w-5" />}
            Cari Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}