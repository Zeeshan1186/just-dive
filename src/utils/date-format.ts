export const simpleDate = (isoDate: Date) => {
  const date = new Date(isoDate);

  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formatted;
};
