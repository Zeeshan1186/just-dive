// utils/time.ts
export function minutesToHourMinuteString(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return "";
  const sign = totalMinutes < 0 ? "-" : "";
  const minutesAbs = Math.abs(Math.round(totalMinutes)); // round to nearest minute
  const hours = Math.floor(minutesAbs / 60);
  const minutes = minutesAbs % 60;

  if (hours === 0) return `${sign}${minutes} Minutes`;
  if (minutes === 0) return `${sign}${hours} Hour`;
  return `${sign}${hours} Hour ${minutes} Minutes`;
}

export function formattedText(text: string) {
  return text.replace(/&/g, "").trim().replace(/\s+/g, "-");
}
