import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}
export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn(
      "glass-card border-white/5 hover-lift group overflow-hidden bg-brand-dark/40",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-brand-gold/10 rounded-xl group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-brand-gold shadow-glow" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full",
              trend.positive 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            )}>
              {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </div>
          )}
        </div>
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</p>
          <p className="text-4xl font-serif font-black text-white mt-2 leading-none">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}