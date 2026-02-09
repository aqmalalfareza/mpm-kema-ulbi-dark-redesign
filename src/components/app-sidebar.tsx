import React from "react";
import {
  Inbox,
  FileText,
  PieChart,
  LogOut,
  User,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Users
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const getMenuItems = () => {
    if (!user) return [];
    const items = [
      { title: "Overview", icon: LayoutDashboard, url: "/dashboard" }
    ];
    if (user.role === 'MPM') {
      items.push(
        { title: "Manajemen Aspirasi", icon: Inbox, url: "/dashboard" },
        { title: "Dokumen Legislatif", icon: FileText, url: "/dashboard" },
        { title: "Struktur KEMA", icon: Users, url: "/dashboard" },
        { title: "Data Statistik", icon: PieChart, url: "/dashboard" }
      );
    } else if (user.role === 'KEMAHASISWAAN') {
      items.push(
        { title: "Inbox Aspirasi", icon: Megaphone, url: "/dashboard" },
        { title: "Riwayat Respon", icon: FileText, url: "/dashboard" }
      );
    } else if (user.role === 'BEM') {
      items.push(
        { title: "Proposal Kegiatan", icon: FileText, url: "/dashboard" },
        { title: "Status Pengajuan", icon: Inbox, url: "/dashboard" }
      );
    }
    return items;
  };
  return (
    <Sidebar className="border-r border-white/5">
      <SidebarHeader className="bg-brand-black p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-gold flex items-center justify-center text-brand-black font-black text-xl shadow-glow">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-serif font-black tracking-tight text-white uppercase">MPM Portal</span>
            <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest leading-none mt-1">
              {user?.role}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-brand-black px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 px-4">
            Navigasi Utama
          </SidebarGroupLabel>
          <SidebarMenu>
            {getMenuItems().map((item, idx) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={idx} className="mb-1">
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className={cn(
                      "py-6 px-4 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-brand-gold/10 text-brand-gold" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <a href={item.url} onClick={(e) => { e.preventDefault(); navigate(item.url); }}>
                      <item.icon className={cn("w-5 h-5", isActive ? "text-brand-gold" : "text-inherit")} />
                      <span className="font-bold text-sm tracking-tight ml-2">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-brand-black border-t border-white/5 p-4">
        <div className="glass-card rounded-2xl p-4 border-white/5 bg-white/5 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-brand-gold/30 p-1">
              <div className="h-full w-full rounded-full bg-brand-gold/10 flex items-center justify-center">
                <User className="h-5 w-5 text-brand-gold" />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.name}</span>
              <span className="text-[10px] text-white/40 truncate font-mono">{user?.username}</span>
            </div>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="py-6 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" /> 
              <span className="font-bold text-sm ml-2">Keluar Sesi</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}