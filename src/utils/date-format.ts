import { format, isValid, parse } from "date-fns";

export const simpleDate = (isoDate: Date) => {
  const date = new Date(isoDate);

  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formatted;
};

export const bookingDateFormat = (rawDate: string) => {
  if (!rawDate) return "No date selected";

  // Try different possible formats
  const possibleFormats = ["yyyy/MM/dd", "yyyy-MM-dd", "d/M/yyyy"];

  let parsedDate: Date | null = null;

  for (const fmt of possibleFormats) {
    const d = parse(rawDate, fmt, new Date());
    if (isValid(d)) {
      parsedDate = d;
      break;
    }
  }

  return parsedDate ? format(parsedDate, "d MMMM yyyy") : rawDate;
};
