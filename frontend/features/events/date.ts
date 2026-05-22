const shortMonths = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function parseEventDate(dateValue: string | Date | null | undefined) {
  if (!dateValue) return null;

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function getHondurasDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const values = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});

  let hours24 = Number(values.hour);
  if (hours24 === 24) hours24 = 0;

  return {
    day: Number(values.day),
    month: Number(values.month),
    year: Number(values.year),
    hours24,
    minutes: Number(values.minute),
  };
}

function formatTime(hours24: number, minutes: number) {
  const period = hours24 >= 12 ? "p. m." : "a. m.";
  const hours12 = hours24 % 12 || 12;
  const paddedMinutes = String(minutes).padStart(2, "0");

  return `${hours12}:${paddedMinutes} ${period}`;
}

export function formatEventDate(dateValue: string | Date | null | undefined) {
  const date = parseEventDate(dateValue);

  if (!date) return "Fecha no disponible";

  const { day, month, year, hours24, minutes } = getHondurasDateParts(date);

  return `${day} de ${shortMonths[month - 1]} de ${year}, ${formatTime(
    hours24,
    minutes
  )}`;
}

export function getEventYear(dateValue: string) {
  const date = parseEventDate(dateValue);
  if (!date) return "";
  return String(getHondurasDateParts(date).year);
}

export function getEventMonth(dateValue: string) {
  const date = parseEventDate(dateValue);
  if (!date) return "";
  return String(getHondurasDateParts(date).month).padStart(2, "0");
}

export function getEventDay(dateValue: string) {
  const date = parseEventDate(dateValue);
  if (!date) return "";

  const { day, month, year } = getHondurasDateParts(date);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export function getEventHour(dateValue: string) {
  const date = parseEventDate(dateValue);
  if (!date) return "";
  return String(getHondurasDateParts(date).hours24).padStart(2, "0");
}

export function getEventWeek(dateValue: string) {
  const date = parseEventDate(dateValue);
  if (!date) return "";

  const { day, month, year } = getHondurasDateParts(date);
  const tempDate = new Date(Date.UTC(year, month - 1, day));
  const dayNumber = tempDate.getUTCDay() || 7;

  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return `${tempDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}
