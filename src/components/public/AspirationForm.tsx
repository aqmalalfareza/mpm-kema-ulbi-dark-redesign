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
import { ClipboardCheck, Loader2, Send } from 'lucide-react';
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
      toast.success("Aspirasi berhasil dikirim!");
    } catch (error) {
      toast.error("Gagal mengirim aspirasi. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setResult(null);
      form.reset();
    }
  };
  const handleCopy = () => {
    if (result?.trackingId) {
      navigator.clipboard.writeText(result.trackingId);
      toast.info("ID Tracking disalin ke clipboard");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all">
          Suarakan Aspirasi Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6 text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-8 h-8 text-green-600" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-display">Berhasil Terkirim!</DialogTitle>
                <DialogDescription className="text-center">
                  Simpan ID Tracking berikut untuk memantau status aspirasi Anda secara real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 bg-secondary/10 border-2 border-dashed border-secondary rounded-xl font-mono text-3xl font-bold tracking-widest text-primary flex items-center justify-between group">
                {result.trackingId}
                <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-secondary/20">
                  <ClipboardCheck className="w-5 h-5" />
                </Button>
              </div>
              <Button className="w-full" onClick={() => handleOpenChange(false)}>Tutup & Kembali</Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Kirim Aspirasi Mahasiswa</DialogTitle>
                <DialogDescription>
                  Sampaikan keluhan, saran, atau ide Anda untuk kemajuan KEMA ULBI.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Kampus</FormLabel>
                          <FormControl><Input placeholder="john@ulbi.ac.id" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AKADEMIK">Akademik</SelectItem>
                            <SelectItem value="FASILITAS">Fasilitas Kampus</SelectItem>
                            <SelectItem value="ORGANISASI">Organisasi & Kemahasiswaan</SelectItem>
                            <SelectItem value="PROPOSAL">Proposal Kegiatan</SelectItem>
                            <SelectItem value="LAINNYA">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subjek</FormLabel>
                        <FormControl><Input placeholder="Judul singkat aspirasi" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detail Aspirasi</FormLabel>
                        <FormControl><Textarea placeholder="Jelaskan aspirasi Anda secara detail..." className="min-h-[120px] resize-none" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Kirim Aspirasi
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}