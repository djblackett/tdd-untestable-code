const millisPerDay = 24 * 60 * 60 * 1000;

export function daysUntilChristmas(date) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
