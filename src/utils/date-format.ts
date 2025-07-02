import { format, parse } from "date-fns";

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
  const parsedDate = parse(rawDate, "d/M/yyyy", new Date());
  const formattedDate = format(parsedDate, "d MMMM yyyy");

  return formattedDate;
};
