import { AnimatedContent } from '@/components/animated-content';
import { HeadingMain } from '@/components/heading-main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GeneralSection } from './_sections/general/general-section';
import { SecuritySection } from './_sections/security/security-section';
import { AdvancedSection } from './_sections/advanced/advanced-section';

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6">
      <HeadingMain title="Configuración" />
      <Tabs defaultValue="gral">
        <TabsList>
          <TabsTrigger value="gral">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
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

        <TabsContent value="advanced" className="py-4">
          <AnimatedContent>
            <AdvancedSection />
          </AnimatedContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
