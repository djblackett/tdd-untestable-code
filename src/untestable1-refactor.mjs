const millisPerDay = 24 * 60 * 60 * 1000;

export function daysUntilChristmas(date) {
  if (!date) {
    date = new Date();
  }

  if (typeof date === "string") {
    date = date.replaceAll("-", "/"); // My timezone (GMT-4) makes the getDate() function unpredictable with hyphens
    date = new Date(date)
  }

  const dateToCheck = new Date(new Date().getFullYear(), date.getMonth(), date.getDate());
  const christmasDay = new Date(dateToCheck.getFullYear(), 12 - 1, 25);

  if (dateToCheck.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }

  const diffMillis = christmasDay.getTime() - dateToCheck.getTime();
  return Math.floor(diffMillis / millisPerDay);
}

