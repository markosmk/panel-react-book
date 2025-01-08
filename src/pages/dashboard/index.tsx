import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs.js';
import { HeadingMain } from '@/components/heading-main.js';
import { AnalyticsSection } from './analytics-section.js';
import { BookingSummarySection } from './bookings-summary.js';

export default function DashboardPage() {
  return (
    <>
      <div className="max-h-screen flex-1 space-y-8 overflow-y-auto px-4 md:px-8">
        <HeadingMain title="Hola, Bienvenido de Nuevo 👋" />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger
              value="analytics"
              disabled
              className="disabled:opacity-40"
            >
              Analíticas (proximamente)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <BookingSummarySection />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
