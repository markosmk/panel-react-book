import { formatDateOnly } from '@/lib/utils';
import React from 'react';

type Log = {
  version: string;
  date: string;
  description: string;
  changes: string[];
};

export function ModalChangelog() {
  const [content, setContent] = React.useState<Log[]>([]);

  React.useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('/assets/changelog.json');
        if (!response.ok) {
          throw new Error('listing not found');
        }
        const data: { changelog: Log[] } = await response.json();
        if (data?.changelog) {
          data.changelog?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setContent(data?.changelog);
        }
      } catch (error) {
        console.error('Error loading changelog:', error);
        setContent([]);
      }
    };

    fetchChangelog();
  }, []);
  return (
    <div className="flex flex-col">
      {content.map((item: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="mb-2 flex justify-between border-b pb-1 text-lg font-semibold">
            v. {item.version}
            <small className="text-sm font-light text-muted-foreground">
              {formatDateOnly(item.date, "EEEE dd 'de' MMMM, yyyy")}
            </small>
          </h3>
          <p className="mb-2 text-sm text-muted-foreground">
            {item.description}
          </p>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {item.changes.map((change: string, index: number) => (
              <li key={index} className="mb-1">
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
