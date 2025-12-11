import { PageContainer } from '@/components/layout/PageContainer';
import { SidebarPageLayout } from '@/components/layout/SidebarPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppConfig } from '@/hooks/useAppConfig';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { toast } from 'sonner';
import { invoke } from '@tauri-apps/api/core';
import { cn } from '@/lib/utils';
import { User, Settings, Shield, Palette, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useTranslation();

  const navItems = [
    { title: t('settings.general'), icon: Settings, id: "general" },
    { title: t('settings.account'), icon: User, id: "account" },
    { title: t('settings.appearance'), icon: Palette, id: "appearance" },
    { title: t('settings.notifications'), icon: Bell, id: "notifications" },
    { title: t('settings.advanced'), icon: Shield, id: "advanced" },
    { title: t('settings.about'), icon: HelpCircle, id: "about" },
  ];

  // The Settings Sidebar itself is now a Card
  const SettingsSidebar = (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-3 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-12 px-4 rounded-lg transition-all duration-200",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground translate-x-1" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <PageContainer title={t('settings.title')}>
      {/* Reset padding to allow full-height sidebar card */}
      <div className="-m-6 h-[calc(100%+3rem)] p-6"> 
        <SidebarPageLayout 
          sidebar={SettingsSidebar} 
          sidebarWidth="w-64"
          className="gap-6"
        >
          <div className="max-w-3xl space-y-6 pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "account" && <AccountSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "advanced" && <AdvancedSettings />}
            {(activeTab === "notifications" || activeTab === "about") && (
              <EmptyState title={t('settings.comingSoon')} description={t('settings.underConstruction')} />
            )}
          </div>
        </SidebarPageLayout>
      </div>
    </PageContainer>
  );
}

// --- Sub-components (All converted to independent Cards) ---

function GeneralSettings() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <SectionHeader title={t('settings.general')} description={t('settings.generalDescription')} />
      
      <div className="grid gap-4">
        {/* Card instead of Separator */}
        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">{t('settings.launchOnStartup')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.launchOnStartupDesc')}
              </p>
            </div>
            <Switch />
          </div>
        </SettingCard>

        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">{t('settings.autoUpdates')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.autoUpdatesDesc')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </SettingCard>

        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">{t('settings.hardwareAcceleration')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.hardwareAccelerationDesc')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { updateSetting } = useAppConfig();
  const { t } = useTranslation();

  const handleThemeChange = async (val: string) => {
    setTheme(val as any);
    await updateSetting({ key: 'theme_mode', value: val });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={t('settings.appearance')} description={t('settings.appearanceDescription')} />

      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t('settings.themeMode')}</CardTitle>
            <CardDescription>{t('settings.themeModeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <ThemeCard 
                mode="light" 
                label={t('settings.light')}
                active={theme === 'light'} 
                onClick={() => handleThemeChange('light')} 
              />
              <ThemeCard 
                mode="dark" 
                label={t('settings.dark')}
                active={theme === 'dark'} 
                onClick={() => handleThemeChange('dark')} 
              />
              <ThemeCard 
                mode="system" 
                label={t('settings.system')}
                active={theme === 'system'} 
                onClick={() => handleThemeChange('system')} 
              />
            </div>
          </CardContent>
        </Card>

        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">{t('settings.reducedMotion')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.reducedMotionDesc')}
              </p>
            </div>
            <Switch />
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function AccountSettings() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <SectionHeader title={t('settings.account')} description={t('settings.accountDescription')} />
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.profileInfo')}</CardTitle>
          <CardDescription>{t('settings.profileInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="username">{t('settings.username')}</Label>
            <Input id="username" defaultValue="johndoe" className="max-w-md" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('settings.email')}</Label>
            <Input id="email" defaultValue="john@example.com" className="max-w-md" />
          </div>
          <div className="flex justify-start">
            <Button>{t('settings.saveChanges')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">{t('settings.session')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">{t('settings.signOut')}</p>
            <p className="text-sm text-muted-foreground">{t('settings.signOutDesc')}</p>
          </div>
          <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            {t('settings.logOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AdvancedSettings() {
  const { t } = useTranslation();
  const handleOpenLogs = async () => {
    try {
      await invoke('open_log_folder');
      toast.success(t('settings.openFolderSuccess'));
    } catch (e) {
      toast.error(t('settings.openFolderError'));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={t('settings.advanced')} description={t('settings.advancedDescription')} />
      
      <div className="grid gap-4">
        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{t('settings.applicationLogs')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.applicationLogsDesc')}</p>
            </div>
            <Button variant="outline" onClick={handleOpenLogs}>{t('settings.openFolder')}</Button>
          </div>
        </SettingCard>

        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{t('settings.databaseHealth')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.databaseHealthDesc')}</p>
            </div>
            <Button variant="outline" onClick={() => invoke('check_db_health').then(res => toast.success(res as string))}>
              {t('settings.checkConnection')}
            </Button>
          </div>
        </SettingCard>

        <Card className="border-destructive/20 bg-destructive/5 mt-4">
          <CardHeader>
            <CardTitle className="text-destructive">{t('settings.dangerZone')}</CardTitle>
            <CardDescription>{t('settings.dangerZoneDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{t('settings.resetDatabase')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.resetDatabaseDesc')}</p>
            </div>
            <Button variant="destructive">{t('settings.resetData')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// --- Helpers ---

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="pb-2">
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  )
}

// Wrapper for simple settings to ensure consistent card style
function SettingCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Card className={cn("p-6 flex flex-col justify-center transition-all hover:shadow-md", className)}>
      {children}
    </Card>
  )
}

function ThemeCard({ mode, label, active, onClick }: { mode: string, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      className={cn(
        "cursor-pointer rounded-xl border-2 p-1 hover:border-primary/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        active ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-card"
      )}
      onClick={onClick}
    >
      <div className="space-y-2 rounded-lg p-2">
        <div className={cn(
          "space-y-2 rounded-md p-2 shadow-sm border",
          mode === "light" ? "bg-[#ecedef] border-gray-200" : mode === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-500 border-slate-600"
        )}>
          <div className={cn("h-2 w-[80px] rounded-lg opacity-80", mode === "light" ? "bg-white" : mode === "dark" ? "bg-slate-800" : "bg-slate-400")} />
          <div className={cn("h-2 w-[100px] rounded-lg opacity-60", mode === "light" ? "bg-white" : mode === "dark" ? "bg-slate-800" : "bg-slate-400")} />
        </div>
      </div>
      <div className="p-2 text-center text-sm font-semibold">{label}</div>
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <Card className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Settings className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-sm mt-2">{description}</p>
    </Card>
  )
}
