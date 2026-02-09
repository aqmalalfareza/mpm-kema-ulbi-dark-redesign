import React from "react";
import { 
  Inbox, 
  FileText, 
  PieChart, 
  Settings, 
  LogOut, 
  User,
  LayoutDashboard,
  Megaphone
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
import { useNavigate } from "react-router-dom";
export function AppSidebar(): JSX.Element {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const getMenuItems = () => {
    if (!user) return [];
    const items = [
      { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" }
    ];
    if (user.role === 'MPM') {
      items.push(
        { title: "Semua Aspirasi", icon: Inbox, url: "/dashboard" },
        { title: "Laporan Legislatif", icon: FileText, url: "/dashboard" },
        { title: "Statistik", icon: PieChart, url: "/dashboard" }
      );
    } else if (user.role === 'KEMAHASISWAAN') {
      items.push(
        { title: "Inbox Tugas", icon: Megaphone, url: "/dashboard" },
        { title: "Draft Jawaban", icon: FileText, url: "/dashboard" }
      );
    } else if (user.role === 'BEM') {
      items.push(
        { title: "Proposals Saya", icon: FileText, url: "/dashboard" },
        { title: "Status Pengajuan", icon: Inbox, url: "/dashboard" }
      );
    }
    return items;
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">M</div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">MPM Portal</span>
            <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{user?.role}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            {getMenuItems().map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url} onClick={(e) => { e.preventDefault(); navigate(item.url); }}>
                    <item.icon /> <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium truncate">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.username}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut /> <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}