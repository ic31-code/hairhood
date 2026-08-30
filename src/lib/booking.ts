export const SLOT_TIMES = [
  "09:00", "09:45", "10:30", "11:15", "12:00", "13:30",
  "14:15", "15:00", "15:45", "16:30", "17:15", "18:00",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type BookingDay = { index: number; label: string; weekday: string };

export function bookingDays(): BookingDay[] {
  const base = new Date();
  const out: BookingDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const weekday = DAY_NAMES[d.getDay()];
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${weekday.slice(0, 3)} ${d.getDate()}`;
    out.push({ index: i, label, weekday });
  }
  return out;
}

export function slotsForDay(dayIndex: number, closed: boolean): { time: string; taken: boolean }[] {
  if (closed) return [];
  return SLOT_TIMES.map((time, i) => ({ time, taken: (i + dayIndex) % 4 === 0 }));
}

export function randomReference(): string {
  return "HH-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}
