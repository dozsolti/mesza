import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Statistic } from './habit-statistics/statistics.types';

export default function StatisticCard({
  stat: { title, value, color, date, isImportant },
}: {
  stat: Statistic;
}) {
  return (
    <Card
      className="relative p-0 border-2"
      style={{
        borderColor: color + "50",
        backgroundColor: color + "10",
      }}
    >
      <CardContent className={cn("flex flex-col justify-between p-4 h-full")}>
        <dt className="flex-1 text-muted-foreground">{title}</dt>
        <dd className="flex flex-col flex-1 space-x-2.5 mt-2 text-end">
          <p
            className={cn(
              "font-semibold text-foreground text-3xl text-end",
              isImportant ? "text-4xl" : null
            )}
          >
            {value}
          </p>
          {date && <p className="text-muted-foreground text-sm">{date}</p>}
        </dd>
      </CardContent>
    </Card>
  );
}
