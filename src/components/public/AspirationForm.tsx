import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  category: z.enum(['AKADEMIK', 'FASILITAS', 'ORGANISASI', 'LAINNYA']),
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
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
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
  }
  const handleCopy = () => {
    if (result?.trackingId) {
      navigator.clipboard.writeText(result.trackingId);
      toast.info("ID Tracking disalin ke clipboard");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if(!v) setResult(null); form.reset(); }}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all">
          Suarakan Aspirasi Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {result ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <ClipboardCheck className="w-8 h-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Berhasil Terkirim!</DialogTitle>
              <DialogDescription className="text-center">
                Simpan ID Tracking berikut untuk memantau status aspirasi Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-muted rounded-lg font-mono text-2xl font-bold tracking-widest text-primary flex items-center justify-between">
              {result.trackingId}
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <ClipboardCheck className="w-4 h-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={() => setIsOpen(false)}>Tutup</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Kirim Aspirasi Mahasiswa</DialogTitle>
              <DialogDescription>
                Sampaikan keluhan, saran, atau ide Anda untuk kemajuan KEMA ULBI.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                      <FormControl><Textarea placeholder="Jelaskan aspirasi Anda secara detail..." className="min-h-[120px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Kirim Aspirasi
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}