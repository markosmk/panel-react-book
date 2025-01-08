import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils.js';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip.js';
import { useRecentBookings, useStats } from '@/services/hooks/use-stats';
import Overview from './components/overview';
import RecentBookings from './components/recent-bookings';

type StatsChangeProps = {
  change: string;
  metric: string;
};

function StatsChange({ change, metric }: StatsChangeProps) {
  const isIncrease = !change.includes('-');
  const tooltipText = isIncrease
    ? `Este incremento del ${change} en ${metric} refleja un aumento en comparación con el mismo periodo del mes anterior (del inicio hasta la fecha actual).`
    : `Esta disminución del ${change.replace('-', '')} en ${metric} refleja una caída en comparación con el mismo periodo del mes anterior (del inicio hasta la fecha actual).`;

  return (
    <Tooltip>
      <TooltipTrigger>
        <p className="text-xs text-muted-foreground">
          {isIncrease && '+'}
          {change} desde el último mes
        </p>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function AnalyticsSection() {
  const { data: stats, isLoading: isLoadingStats } = useStats();
  const { data: recents, isLoading: isLoadingRecents } = useRecentBookings();
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatPrice(Number(stats?.income.total) || 0)}
            </div>
            <StatsChange
              change={stats?.income.change ?? ''}
              metric="ingresos"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.visitors.total ? '+' : ''}
              {stats?.visitors.total}
            </div>
            <StatsChange
              change={stats?.visitors.change ?? ''}
              metric="visitantes"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
              <path d="M18 14v4h4" />
              <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
              <path d="M15 3v4" />
              <path d="M7 3v4" />
              <path d="M3 11h16" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_bookings_confirmed ? '+' : ''}
              {stats?.total_bookings_confirmed}
            </div>
            <StatsChange
              change={stats?.bookings.change ?? ''}
              metric="reservas"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacado</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
              <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" />
              <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {stats?.popularTour?.tour_name}
            </div>
            <p className="text-xs text-muted-foreground">
              Tour mas popular del mes
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vision General</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              isLoading={isLoadingStats}
              data={stats?.monthly_income as Record<string, number>}
            />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
            <CardDescription>
              Tienes {stats?.total_bookings_pending ?? 0} reservas pendientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings data={recents} isLoading={isLoadingRecents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
