import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { AuthResponse } from '@shared/types';
import { motion } from 'framer-motion';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(res.user);
      toast.success(`Selamat datang, ${res.user.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };
  const setDemo = (user: string) => {
    setUsername(user);
    setPassword('demo123');
  };
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,97,0.1),transparent_70%)]" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-black mb-6 shadow-glow relative">
              <ShieldCheck className="w-10 h-10" />
              <div className="absolute -inset-1 bg-brand-gold/20 rounded-2xl animate-pulse -z-10" />
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-white mb-2">Portal Internal</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">KEMA ULBI Executive Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Username</Label>
              <Input
                id="username"
                placeholder="admin_mpm"
                className="bg-white/5 border-white/10 focus:border-brand-gold py-6 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Katasandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 focus:border-brand-gold py-6 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full py-7 bg-brand-gold text-brand-black font-black uppercase tracking-[0.2em] hover:bg-brand-gold/90 transition-all shadow-glow" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Autentikasi"}
            </Button>
          </form>
          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-[10px] font-black text-center text-white/20 uppercase tracking-[0.2em] mb-4">Akses Cepat Demo</p>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:text-brand-gold text-[10px] font-bold py-5" onClick={() => setDemo('admin_mpm')}>MPM</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:text-brand-gold text-[10px] font-bold py-5" onClick={() => setDemo('staff_kema')}>STAFF</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:text-brand-gold text-[10px] font-bold py-5" onClick={() => setDemo('bem_ulbi')}>BEM</Button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 flex items-center justify-center gap-2 w-full text-white/30 hover:text-brand-gold transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
      </motion.div>
    </div>
  );
}