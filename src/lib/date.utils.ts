import { format, formatDistanceToNowStrict, formatRelative } from 'date-fns';

export function formatDate(
  date: Date | string,
  formatType: "date" | "time" | "datetime"
) {
  switch (formatType) {
    case "date":
      return format(date, "PP");
    case "time":
      return format(date, "p");
    case "datetime":
      return format(date, "dd MMM yy HH:mm");
  }
}

export function formatDateRelativeToday(date: Date) {
  return formatRelative(date, new Date());
}

/// date2 - date1
export function formatTimeSince(date: Date, date2: Date = new Date()) {
  const diffMs = date2.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 5) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else if (diffDay >= 1) {
    const hours = diffHour % 24;
    return `${diffDay} days` + (hours !== 0 ? ` ${hours} hour${hours > 1 ? 's' : ''}` : "");
  } else if (diffHour >= 1) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  } else if (diffMin >= 1) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else {
    return `${diffSec} second${diffSec > 1 ? 's' : ''}`;
  }
}
