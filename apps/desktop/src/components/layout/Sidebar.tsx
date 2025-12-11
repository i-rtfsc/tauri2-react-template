import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Box
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const navItems: NavItem[] = [
    { title: t('nav.home'), href: '/', icon: Home },
    { title: t('nav.users'), href: '/users', icon: Users },
    { title: t('nav.components'), href: '/components', icon: Box },
  ];

  const bottomItems: NavItem[] = [
    { title: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div
      className={cn(
        // Base styles
        "flex flex-col h-full px-2 pb-2 gap-2 transition-all duration-300 ease-out z-20",
        // Width control
        collapsed ? "w-[60px]" : "w-[180px]", // Slightly wider expanded state for better breathing room
        // Interactive visual effects
        "hover:bg-muted/30", // Subtle background on hover
        className
      )}
    >
      {/* Top Spacer for Traffic Lights */}
      <div className="h-10 w-full shrink-0 transition-all" data-tauri-drag-region />

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pt-2">
        <NavGroup items={navItems} currentPath={location.pathname} collapsed={collapsed} />
      </div>

      {/* Footer Items */}
      <div className="mt-auto flex flex-col gap-2">
        <NavGroup items={bottomItems} currentPath={location.pathname} collapsed={collapsed} />
        
        {/* Toggle Button - Now styled as a pill */}
        <div className={cn("flex items-center mt-2 transition-all duration-300", collapsed ? "justify-center" : "justify-end px-2")}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/50 hover:bg-background shadow-sm border border-transparent hover:border-border transition-all hover:scale-110"
            onClick={toggleCollapse}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function NavGroup({ items, currentPath, collapsed }: { items: NavItem[], currentPath: string, collapsed: boolean }) {
  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid gap-1 px-1">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;
          
          // Icon Only Mode (Collapsed)
          if (collapsed) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 group relative",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md scale-105" 
                        : "text-muted-foreground hover:bg-white/80 dark:hover:bg-white/10 hover:text-foreground hover:scale-105 hover:shadow-sm"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:rotate-3", isActive && "text-primary-foreground")} />
                    <span className="sr-only">{item.title}</span>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-foreground/30 rounded-r-full hidden" />} 
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium animate-in fade-in slide-in-from-left-1">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          // Full Mode (Expanded)
          return (
            <NavLink
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-white dark:bg-white/10 text-foreground shadow-sm ring-1 ring-border/50 translate-x-1" 
                  : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors duration-200", 
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="transition-all duration-300">
                {item.title}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
