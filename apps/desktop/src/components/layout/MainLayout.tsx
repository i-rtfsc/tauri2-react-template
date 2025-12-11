import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AppCommand } from './AppCommand';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40 text-foreground">
      {/* Sidebar - Fixed Left */}
      <Sidebar className="shrink-0 z-20 bg-transparent border-r-0" />

      {/* Main Content Area - The "Card" Look */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative p-2 pl-0">
        {/* Global Window Drag Region (Top 24px) - pointer-events-none to allow clicks through */}
        <div data-tauri-drag-region className="h-6 w-full shrink-0 z-50 absolute top-0 left-0 pointer-events-none" />
        
        {/* The Page Card */}
        <div className="flex-1 h-full overflow-hidden bg-background rounded-xl border shadow-sm relative flex flex-col">
           {children}
        </div>
      </main>
      
      <Toaster />
      <AppCommand />
    </div>
  );
}
