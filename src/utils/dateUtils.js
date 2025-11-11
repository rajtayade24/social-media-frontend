/**
 * Convert an ISO timestamp into a compact relative string.
 */
export function relativeTimeCompact(iso, now = new Date()) {
  const then = iso instanceof Date ? iso : new Date(iso);
  const nowDate = now instanceof Date ? now : new Date(now);

  if (isNaN(then)) return 'invalid date';

  const diffMs = nowDate.getTime() - then.getTime();
  if (diffMs < 0) return 'in the future';

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute));
    return `${mins}min`;
  }
  if (diffMs < day) {
    const hrs = Math.floor(diffMs / hour);
    return `${hrs}hr${hrs > 1 ? 's' : ''}`;
  }
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days}day${days > 1 ? 's' : ''}`;
  }

  const yearsDiff = nowDate.getFullYear() - then.getFullYear();
  const monthsDiff = yearsDiff * 12 + (nowDate.getMonth() - then.getMonth());

  if (monthsDiff < 1) {
    const weeks = Math.max(1, Math.floor(diffMs / week));
    return `${weeks}week${weeks > 1 ? 's' : ''}`;
  }
  if (monthsDiff < 12) {
    return `${monthsDiff}month${monthsDiff > 1 ? 's' : ''}`;
  }

  const years = Math.floor(monthsDiff / 12);
  return `${years}yr${years > 1 ? 's' : ''}`;
}
