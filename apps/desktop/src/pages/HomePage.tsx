import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, Activity, CreditCard, DollarSign } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const rawChartData = [
  { key: 'jan', total: 1200 },
  { key: 'feb', total: 2100 },
  { key: 'mar', total: 1800 },
  { key: 'apr', total: 2400 },
  { key: 'may', total: 3200 },
  { key: 'jun', total: 4500 },
  { key: 'jul', total: 4100 },
];

export function HomePage() {
  const { t } = useTranslation();

  const chartData = useMemo(
    () => rawChartData.map((item) => ({
      total: item.total,
      name: t(`home.chart.months.${item.key}`),
    })),
    [t]
  );

  const kpis = [
    {
      title: t('home.kpis.totalRevenue'),
      value: '$45,231.89',
      change: t('home.kpis.totalRevenueChange'),
      icon: DollarSign,
    },
    {
      title: t('home.kpis.subscriptions'),
      value: '+2350',
      change: t('home.kpis.subscriptionsChange'),
      icon: Users,
    },
    {
      title: t('home.kpis.sales'),
      value: '+12,234',
      change: t('home.kpis.salesChange'),
      icon: CreditCard,
    },
    {
      title: t('home.kpis.activeNow'),
      value: '+573',
      change: t('home.kpis.activeNowChange'),
      icon: Activity,
    },
  ];

  return (
    <PageContainer 
      title={
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('home.dashboardTitle')}</h1>
          <p className="text-sm text-muted-foreground font-normal">{t('home.welcomeBack')}</p>
        </div>
      }
      actions={
        <Button className="shadow-lg hover:shadow-xl transition-all">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          {t('home.actions.viewReports')}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <KpiCard 
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
            />
          ))}
        </div>

        {/* Main Charts Area */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Big Chart */}
          <Card className="col-span-4 shadow-md border-none ring-1 ring-border/50">
            <CardHeader>
              <CardTitle>{t('home.overview.title')}</CardTitle>
              <CardDescription>{t('home.overview.description')}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Side Chart / List */}
          <Card className="col-span-3 shadow-md border-none ring-1 ring-border/50">
            <CardHeader>
              <CardTitle>{t('home.recentSales.title')}</CardTitle>
              <CardDescription>{t('home.recentSales.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Mock Sales List */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      OM
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Olivia Martin</p>
                      <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function KpiCard({ title, value, change, icon: Icon }: any) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-none ring-1 ring-border/50 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {change}
        </p>
      </CardContent>
    </Card>
  );
}