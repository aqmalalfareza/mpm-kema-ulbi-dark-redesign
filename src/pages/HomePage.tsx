import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { AspirationForm } from '@/components/public/AspirationForm';
import { StatusCheck } from '@/components/public/StatusCheck';
import { 
  ShieldCheck, 
  Zap, 
  Search, 
  ChevronRight, 
  Users, 
  FileText,
  MessageSquareText
} from 'lucide-react';
export function HomePage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <ThemeToggle />
      <Toaster richColors position="top-center" />
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              MPM <span className="text-primary">KEMA ULBI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#stats" className="hover:text-primary transition-colors">Statistik</a>
            <a href="#about" className="hover:text-primary transition-colors">Tentang Kami</a>
          </nav>
          <div className="flex items-center gap-4">
            <StatusCheck />
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(30,64,175,0.1),rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Portal Aspirasi Terpadu 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.1] animate-fade-in">
              Suara Anda, <span className="text-primary">Masa Depan</span> Kampus Kita.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in delay-100">
              Platform digital Majelis Permusyawaratan Mahasiswa (MPM) KEMA ULBI untuk menampung, 
              mengawal, dan mewujudkan aspirasi mahasiswa secara transparan dan akuntabel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in delay-200">
              <AspirationForm />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Digunakan oleh 1000+ Mahasiswa ULBI</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Mengapa Melalui Portal Ini?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami membangun sistem ini untuk memastikan setiap suara didengar dan diproses secara profesional oleh pemangku kebijakan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Privasi Terjamin", 
                desc: "Data pelapor aman dan hanya digunakan untuk keperluan verifikasi serta tindak lanjut aspirasi.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                icon: Zap, 
                title: "Proses Cepat", 
                desc: "Aspirasi langsung diteruskan ke departemen terkait secara otomatis tanpa birokrasi berbelit.",
                color: "text-yellow-600",
                bg: "bg-yellow-50"
              },
              { 
                icon: Search, 
                title: "Tracking Real-time", 
                desc: "Pantau sejauh mana aspirasi Anda diproses melalui sistem pelacakan unik kapan saja.",
                color: "text-green-600",
                bg: "bg-green-50"
              }
            ].map((f, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
                <div className={`${f.bg} ${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats/Summary Section */}
      <section id="stats" className="py-20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Total Aspirasi", val: "2,450", icon: FileText },
              { label: "Dalam Proses", val: "124", icon: Clock },
              { label: "Selesai", val: "2,100", icon: CheckCircle2 },
              { label: "Respon Cepat", val: "24 Jam", icon: Zap },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-center mb-2"><s.icon className="w-5 h-5 text-primary/60" /></div>
                <div className="text-3xl font-bold text-primary">{s.val}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action Footer Area */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-primary rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Punya Masukan untuk Kampus?</h2>
          <p className="text-primary-foreground/90 text-lg mb-10 max-w-2xl mx-auto">
            Jangan biarkan ide dan keluhan Anda hanya menjadi bahan diskusi di kantin. 
            Sampaikan secara resmi melalui jalur legislatif MPM KEMA ULBI.
          </p>
          <AspirationForm />
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <span className="font-bold text-xl">MPM KEMA ULBI</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm">
                Majelis Permusyawaratan Mahasiswa Universitas Logistik dan Bisnis Internasional. 
                Wadah aspirasi dan pengawasan organisasi kemahasiswaan tertinggi di tingkat universitas.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Tautan Cepat</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Undang-Undang KEMA</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Struktur Organisasi</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Program Kerja</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Arsip Dokumen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Kontak Kami</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4" />
                  <span>mpm@ulbi.ac.id</span>
                </li>
                <li>Gedung Rektorat Lt. 2</li>
                <li>Jl. Sariasih No. 54, Bandung</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 MPM KEMA ULBI. Dikembangkan untuk kemajuan Almamater.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary">Instagram</a>
              <a href="#" className="hover:text-primary">Twitter/X</a>
              <a href="#" className="hover:text-primary">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}