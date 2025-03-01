import { AnimatedContent } from '@/components/animated-content';
import { HeadingMain } from '@/components/heading-main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GeneralSection } from './_sections/general/general-section';
import { SecuritySection } from './_sections/security/security-section';
import { AdvancedSection } from './_sections/advanced/advanced-section';
import { ComplementsSection } from './_sections/complements/complements-section';
import { useAuthStore } from '@/stores/use-auth-store';
import { Role } from '@/types/user.types';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6">
      <HeadingMain title="Configuración" />
      <Tabs defaultValue="gral">
        <TabsList>
          <TabsTrigger value="gral">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          {user?.role === Role.SUPERADMIN && (
            <TabsTrigger value="restore">Restaurar</TabsTrigger>
          )}
          {user?.role === Role.SUPERADMIN && (
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="gral" className="py-4">
          <AnimatedContent>
            <GeneralSection />
          </AnimatedContent>
        </TabsContent>

        <TabsContent value="security" className="py-4">
          <AnimatedContent>
            <SecuritySection />
          </AnimatedContent>
        </TabsContent>

        {user?.role === Role.SUPERADMIN && (
          <TabsContent value="restore" className="py-4">
            <AnimatedContent>
              <ComplementsSection />
            </AnimatedContent>
          </TabsContent>
        )}

        {user?.role === Role.SUPERADMIN && (
          <TabsContent value="advanced" className="py-4">
            <AnimatedContent>
              <AdvancedSection />
            </AnimatedContent>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
