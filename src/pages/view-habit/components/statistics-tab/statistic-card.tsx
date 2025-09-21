import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatisticCard({
  title,
  value,
  date,
  color,
  isImportant = false,
}: {
  title: string;
  value: string | number;
  date?: string;
  color: string;
  isImportant?: boolean;
}) {
  const isShort = value.toString().length < 5;
  return (
    <Card
      className="relative p-0 border-2"
      style={{
        borderColor: color + "50",
        backgroundColor: color + "10",
      }}
    >
      <CardContent
        className={cn(
          "flex justify-between p-4 h-full",
          isImportant && isShort ? "flex-row" : "flex-col"
        )}
      >
        <dt className="flex-1 text-muted-foreground">{title}</dt>
        <dd className="flex flex-col flex-1 space-x-2.5 mt-2 text-end">
          <p
            className={cn(
              "font-semibold text-foreground text-3xl text-end",
              isImportant ? (isShort ? "text-6xl" : "text-3xl") : null
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
