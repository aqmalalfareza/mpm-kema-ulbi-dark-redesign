import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { AuthResponse } from '@shared/types';
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Portal Internal MPM</CardTitle>
          <CardDescription>Masuk untuk mengelola aspirasi mahasiswa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="admin_mpm" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Masuk ke Dashboard
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">Login Cepat (Demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDemo('admin_mpm')}>MPM</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDemo('staff_kema')}>Staff</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDemo('bem_ulbi')}>BEM</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-xs text-muted-foreground">Kembali ke Beranda</Button>
        </CardFooter>
      </Card>
    </div>
  );
}