type DayHours = {
  day: string;
  closed?: boolean | null;
  openTime?: string | null;
  closeTime?: string | null;
};

function londonWeekday(): string | undefined {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
  }).format(new Date());
}

export function todayHours(hours: DayHours[] | null | undefined): { day: string; label: string } | null {
  if (!hours?.length) return null;

  const weekday = londonWeekday();
  const today = hours.find((h) => h.day === weekday);
  if (!today) return null;

  return {
    day: today.day,
    label: today.closed || !today.openTime || !today.closeTime ? "Closed today" : `${today.openTime} – ${today.closeTime}`,
  };
}

export function isOpenNow(hours: DayHours[] | null | undefined): boolean {
  if (!hours?.length) return false;

  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const minutesNow = hour * 60 + minute;

  const today = hours.find((h) => h.day === weekday);
  if (!today || today.closed || !today.openTime || !today.closeTime) return false;

  const [openH, openM] = today.openTime.split(":").map(Number);
  const [closeH, closeM] = today.closeTime.split(":").map(Number);

  return minutesNow >= openH * 60 + openM && minutesNow < closeH * 60 + closeM;
}
