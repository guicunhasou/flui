import type {
  ChargingStation,
  StationOpeningPeriod,
  Weekday,
} from '../types';

const weekdayByShortName: Record<string, Weekday> = {
  Sun: 'sun',
  Mon: 'mon',
  Tue: 'tue',
  Wed: 'wed',
  Thu: 'thu',
  Fri: 'fri',
  Sat: 'sat',
};

type LocalDateTime = {
  weekday: Weekday;
  minutes: number;
};

function parseTimeToMinutes(time: string) {
  const [hoursPart, minutesPart] = time.split(':');
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function getLocalDateTime(date: Date, timeZone: string): LocalDateTime | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const weekdayPart = parts.find((part) => part.type === 'weekday')?.value;
    const hourPart = parts.find((part) => part.type === 'hour')?.value;
    const minutePart = parts.find((part) => part.type === 'minute')?.value;
    const weekday = weekdayPart ? weekdayByShortName[weekdayPart] : undefined;
    const hours = Number(hourPart);
    const minutes = Number(minutePart);

    if (!weekday || !Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return null;
    }

    return { weekday, minutes: hours * 60 + minutes };
  } catch {
    return null;
  }
}

function periodIncludesTime(
  period: StationOpeningPeriod,
  localDateTime: LocalDateTime,
) {
  if (!period.days.includes(localDateTime.weekday)) {
    return false;
  }

  const opensAt = parseTimeToMinutes(period.opensAt);
  const closesAt = parseTimeToMinutes(period.closesAt);

  if (opensAt === null || closesAt === null) {
    return false;
  }

  if (opensAt === 0 && closesAt === 24 * 60) {
    return true;
  }

  if (closesAt > opensAt) {
    return localDateTime.minutes >= opensAt && localDateTime.minutes < closesAt;
  }

  return localDateTime.minutes >= opensAt || localDateTime.minutes < closesAt;
}

export function isStationOpenAt(
  station: ChargingStation,
  date = new Date(),
) {
  if (!station.openingSchedule || station.status === 'maintenance') {
    return false;
  }

  const localDateTime = getLocalDateTime(
    date,
    station.openingSchedule.timeZone,
  );

  if (!localDateTime) {
    return false;
  }

  return station.openingSchedule.periods.some((period) =>
    periodIncludesTime(period, localDateTime),
  );
}
