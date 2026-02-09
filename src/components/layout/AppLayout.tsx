import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("bg-brand-black text-white/90 min-h-screen", className)}>
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-brand-black/95 px-4 backdrop-blur-md lg:hidden">
          <SidebarTrigger />
          <div className="h-6 w-px bg-white/10" />
          <span className="text-sm font-serif font-black tracking-tight text-brand-gold uppercase">MPM Portal</span>
        </div>
        <div className={cn(
          "flex-1 relative",
          container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12",
          contentClassName
        )}>
          <div className="hidden lg:block absolute left-4 top-4 z-40 opacity-20 hover:opacity-100 transition-opacity">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}