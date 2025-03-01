import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ItemSection = {
  label: string;
  value: string | number | React.ReactNode;
  /* until 6 */
  colSpan?: number;
  className?: string;
};

type FooterSection = React.ReactNode | string;

interface InfoSectionProps {
  title?: string;
  subtitle?: React.ReactNode;
  items: ItemSection[];
  footer?: FooterSection;
  /** change for ex: grid-cols-4 */
  className?: string;
}

const ItemRow = React.memo(({ item }: { item: ItemSection }) => (
  <div
    className={cn('space-y-1', {
      'col-span-1': item.colSpan === 1,
      'col-span-2': item.colSpan === 2,
      'col-span-3': item.colSpan === 3,
      'col-span-4': item.colSpan === 4,
      'col-span-5': item.colSpan === 5,
      'col-span-6': item.colSpan === 6
    })}
  >
    <p className="text-xs text-muted-foreground">{item.label}:</p>
    <p className={cn('font-semibold', item.className)}>{item.value}</p>
  </div>
));
ItemRow.displayName = 'ItemRow';

const SectionFooter = React.memo(({ footer }: { footer: FooterSection }) => {
  if (!footer) return null;

  return typeof footer === 'string' ? (
    <li className="px-4 py-3">
      <p className="text-xs text-muted-foreground">{footer}</p>
    </li>
  ) : (
    footer
  );
});
SectionFooter.displayName = 'SectionFooter';

const SectionInfo = ({
  title,
  subtitle,
  items,
  footer,
  className
}: InfoSectionProps) => {
  const renderContent = React.useCallback(
    () => (
      <ul className="flex flex-col">
        <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
          <div className={cn('grid w-full grid-cols-3 gap-2', className)}>
            {items.map((item, index) => (
              <ItemRow key={`${index}-row`} item={item} />
            ))}
          </div>
        </li>
        {footer && <SectionFooter footer={footer} />}
      </ul>
    ),
    [items, footer, className]
  );

  if (!title) return renderContent();

  return (
    <div>
      <h4 className="flex w-full text-xs uppercase text-muted-foreground">
        {title}
        {subtitle && (
          <small className="ml-auto text-xs lowercase">{subtitle}</small>
        )}
      </h4>
      <Card className="mt-2 overflow-hidden">{renderContent()}</Card>
    </div>
  );
};
SectionInfo.displayName = 'SectionInfo';

export { SectionInfo };
