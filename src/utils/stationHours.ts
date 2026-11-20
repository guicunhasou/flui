import type {
  ChargingStation,
  StationOpeningPeriod,
  StationOpeningSchedule,
  Weekday,
} from "../types";

const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekdayNames: Record<string, Weekday> = {
  Sun: "sun",
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

function parseTime(time: string, closing = false): number | null {
  if (!/^\d{2}:\d{2}$/.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (closing && hours === 24 && minutes === 0) return 1440;
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

// O calendário estruturado é autoritativo. O fallback reconhece somente os
// formatos já usados pelo catálogo local, sem alterar os dados da demonstração.
export function getStationSchedule(
  station: ChargingStation,
): StationOpeningSchedule | null {
  if (station.openingSchedule) return station.openingSchedule;
  const text = station.openingHours
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (/^24 horas(?:, todos os dias)?$/.test(text)) {
    return {
      timeZone: "America/Sao_Paulo",
      periods: [{ days: weekdays, opensAt: "00:00", closesAt: "24:00" }],
    };
  }
  const match = text.match(
    /^(todos os dias|segunda a sabado),\s*(\d{1,2})h(?:(\d{2}))?\s*(?:as|a)\s*(\d{1,2})h(?:(\d{2}))?$/,
  );
  if (!match) return null;
  return {
    timeZone: "America/Sao_Paulo",
    periods: [
      {
        days: match[1] === "todos os dias" ? weekdays : weekdays.slice(1),
        opensAt: `${match[2].padStart(2, "0")}:${match[3] ?? "00"}`,
        closesAt: `${match[4].padStart(2, "0")}:${match[5] ?? "00"}`,
      },
    ],
  };
}

function validPeriod(period: StationOpeningPeriod) {
  const opens = parseTime(period.opensAt);
  const closes = parseTime(period.closesAt, true);
  return (
    opens !== null &&
    closes !== null &&
    opens !== closes &&
    period.days.length > 0 &&
    period.days.every((day) => weekdays.includes(day))
  );
}

export function getStationOpeningState(
  station: ChargingStation,
  date = new Date(),
): "open" | "closed" | "unknown" {
  if (station.status === "maintenance" || station.status === "unavailable")
    return "closed";
  const schedule = getStationSchedule(station);
  if (!schedule || !schedule.periods.every(validPeriod)) return "unknown";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: schedule.timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const weekday =
      weekdayNames[parts.find((p) => p.type === "weekday")?.value ?? ""];
    if (!weekday) return "unknown";
    const minutes =
      Number(parts.find((p) => p.type === "hour")?.value) * 60 +
      Number(parts.find((p) => p.type === "minute")?.value);
    const previousDay = weekdays[(weekdays.indexOf(weekday) + 6) % 7];
    const open = schedule.periods.some((period) => {
      const opens = parseTime(period.opensAt)!;
      const closes = parseTime(period.closesAt, true)!;
      if (closes > opens)
        return (
          period.days.includes(weekday) && minutes >= opens && minutes < closes
        );
      return (
        (period.days.includes(weekday) && minutes >= opens) ||
        (period.days.includes(previousDay) && minutes < closes)
      );
    });
    return open ? "open" : "closed";
  } catch {
    return "unknown";
  }
}

export function isStationOpenAt(station: ChargingStation, date = new Date()) {
  return getStationOpeningState(station, date) === "open";
}

export function isStationOpen24Hours(station: ChargingStation) {
  if (station.status === "maintenance" || station.status === "unavailable")
    return false;
  const schedule = getStationSchedule(station);
  if (!schedule) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: schedule.timeZone });
  } catch {
    return false;
  }
  return (
    schedule.periods.every(validPeriod) &&
    weekdays.every((day) =>
      schedule.periods.some(
        (period) =>
          period.days.includes(day) &&
          period.opensAt === "00:00" &&
          period.closesAt === "24:00",
      ),
    )
  );
}
