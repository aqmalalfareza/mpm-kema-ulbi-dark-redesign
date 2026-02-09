import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { ClipboardCheck, Loader2, Send, Sparkles } from 'lucide-react';
import type { Aspiration } from '@shared/types';
const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  category: z.enum(['AKADEMIK', 'FASILITAS', 'ORGANISASI', 'PROPOSAL', 'LAINNYA']),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});
export function AspirationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Aspiration | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'LAINNYA',
      name: '',
      email: '',
      subject: '',
      description: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const data = await api<Aspiration>('/api/aspirations', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      setResult(data);
      toast.success("Aspirasi Anda telah diterima oleh sistem.");
    } catch (error) {
      toast.error("Terjadi kendala teknis. Mohon coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) setResult(null); }}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-10 py-7 text-lg font-black uppercase tracking-widest rounded-full shadow-glow hover:scale-105 transition-all">
          <Sparkles className="mr-2 w-5 h-5" /> Suarakan Aspirasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-brand-dark border-white/10 text-white">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center space-y-8">
              <div className="mx-auto w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20 shadow-glow">
                <ClipboardCheck className="w-10 h-10 text-brand-gold" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-serif font-black">Berhasil Terkirim</DialogTitle>
                <DialogDescription className="text-center text-white/50">
                  Simpan ID Tracking unik ini untuk memantau perkembangan aspirasi Anda secara real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="p-8 bg-white/5 border border-brand-gold/30 rounded-2xl font-mono text-3xl font-black tracking-[0.2em] text-brand-gold flex items-center justify-between group">
                {result.trackingId}
                <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(result.trackingId); toast.info("Disalin"); }} className="hover:bg-brand-gold/10 text-brand-gold">
                  <ClipboardCheck className="w-6 h-6" />
                </Button>
              </div>
              <Button className="w-full bg-brand-gold text-brand-black font-bold uppercase tracking-widest py-6" onClick={() => setIsOpen(false)}>Kembali</Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl font-black tracking-tight">Kirim Aspirasi</DialogTitle>
                <DialogDescription className="text-white/50">Sampaikan keresahan atau ide konstruktif Anda untuk KEMA ULBI.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Nama Lengkap</FormLabel>
                        <FormControl><Input placeholder="John Doe" className="bg-white/5 border-white/10 focus:border-brand-gold transition-colors" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Email Kampus</FormLabel>
                        <FormControl><Input placeholder="name@ulbi.ac.id" className="bg-white/5 border-white/10 focus:border-brand-gold transition-colors" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-brand-dark border-white/10 text-white">
                          <SelectItem value="AKADEMIK">Akademik</SelectItem>
                          <SelectItem value="FASILITAS">Fasilitas Kampus</SelectItem>
                          <SelectItem value="ORGANISASI">Organisasi</SelectItem>
                          <SelectItem value="PROPOSAL">Proposal</SelectItem>
                          <SelectItem value="LAINNYA">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Subjek</FormLabel>
                      <FormControl><Input placeholder="Judul aspirasi" className="bg-white/5 border-white/10 focus:border-brand-gold transition-colors" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Deskripsi Detail</FormLabel>
                      <FormControl><Textarea placeholder="Uraikan aspirasi Anda..." className="min-h-[140px] bg-white/5 border-white/10 focus:border-brand-gold transition-colors resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full py-7 bg-brand-gold text-brand-black font-black uppercase tracking-[0.2em]" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Kirim Sekarang"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}