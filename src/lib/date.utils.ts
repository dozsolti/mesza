import { format, isToday, isYesterday } from 'date-fns';

export function formatDate(
  date: Date,
  formatType: "date" | "time" | "datetime"
) {
  switch (formatType) {
    case "date":
      return format(date, "PP");
    case "time":
      return format(date, "p");
    case "datetime":
      return format(date, "PPpp");
  }
}

export function formatDateRelativeToday(date: Date) {
  if (isToday(date)) {
    return formatDate(date, "time");
  }
  if (isYesterday(date)) {
    return "yesterday " + formatDate(date, "time");
  }
  return formatDate(date, "date");
}
