import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { AspirationForm } from '@/components/public/AspirationForm';
import { StatusCheck } from '@/components/public/StatusCheck';
import { api } from '@/lib/api-client';
import type { DashboardStats } from '@shared/types';
import {
  ShieldCheck,
  Zap,
  Search,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  LogIn,
  ChevronRight
} from 'lucide-react';
export function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  useEffect(() => {
    api<DashboardStats>('/api/stats')
      .then(setStats)
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-gold selection:text-brand-black">
      <ThemeToggle className="top-6 right-6" />
      <Toaster richColors position="top-center" />
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-brand-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center text-brand-black font-black text-xl shadow-glow">M</div>
            <span className="font-serif font-bold text-2xl tracking-tight hidden sm:inline-block">
              MPM <span className="text-brand-gold">ULBI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-brand-gold transition-colors">Visi & Fitur</a>
            <a href="#workflow" className="hover:text-brand-gold transition-colors">Alur</a>
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold transition-all">
              <LogIn className="w-4 h-4" />
              Staff Portal
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <StatusCheck />
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,169,97,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-gold text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            Platform Aspirasi Mahasiswa Terpadu
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[5.5rem] font-serif font-black tracking-tighter leading-[1] mb-10 animate-fade-in">
            Suara Anda,<br /><span className="text-brand-gold italic">Wujud Perubahan.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in delay-100">
            Majelis Permusyawaratan Mahasiswa ULBI hadir sebagai wadah profesional untuk mengawal setiap aspirasi demi kemajuan almamater tercinta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-200">
            <AspirationForm />
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-black bg-brand-dark flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
              <div className="pl-4 flex items-center text-sm text-white/40">
                <span className="font-bold text-white mr-1">{stats?.total ?? '1k'}+</span> Mahasiswa Bergabung
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-brand-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Aspirasi Masuk", val: stats?.total ?? "2,450", icon: FileText },
              { label: "Sedang Ditinjau", val: stats?.pending ?? "124", icon: Clock },
              { label: "Tuntas Diproses", val: stats?.completed ?? "2,100", icon: CheckCircle2 },
              { label: "Respon Cepat", val: "24 Jam", icon: Zap },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="flex justify-center mb-4"><s.icon className="w-6 h-6 text-brand-gold/40 group-hover:text-brand-gold transition-colors" /></div>
                <div className="text-4xl font-serif font-black text-white mb-2">{s.val}</div>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Workflow Section */}
      <section id="workflow" className="py-32 bg-brand-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Alur Kerja <span className="text-brand-gold">Elegansi.</span></h2>
              <p className="text-white/50 leading-relaxed">Sistem transparan yang menjamin setiap aspirasi melewati tahapan verifikasi dan tindak lanjut yang tepat.</p>
            </div>
            <div className="flex items-center gap-2 text-brand-gold font-bold text-sm tracking-widest uppercase cursor-pointer hover:gap-4 transition-all">
              Lihat Selengkapnya <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {['Submit', 'Review MPM', 'Diproses', 'Tanggapan', 'Selesai'].map((step, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl hover-lift group border-white/5">
                <div className="text-brand-gold/20 font-serif font-black text-6xl mb-4 group-hover:text-brand-gold/40 transition-colors">0{idx + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step}</h3>
                <div className="w-8 h-1 bg-brand-gold mb-4" />
                <p className="text-xs text-white/40 leading-relaxed">Proses digitalisasi aspirasi yang menjamin keamanan data mahasiswa.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-brand-dark py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-black font-black text-2xl mx-auto mb-8">M</div>
          <h4 className="text-xl font-serif font-bold mb-4 tracking-wider">MPM KEMA ULBI</h4>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-10">Majelis Permusyawaratan Mahasiswa Universitas Logistik dan Bisnis Internasional.</p>
          <div className="flex justify-center gap-8 text-white/30 text-xs font-bold uppercase tracking-widest mb-20">
            <a href="#" className="hover:text-brand-gold transition-colors">Undang-Undang</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Struktur</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Kontak</a>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
            © 2024 Diciptakan untuk Kemajuan Almamater
          </div>
        </div>
      </footer>
    </div>
  );
}