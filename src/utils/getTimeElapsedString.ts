export function timeSince(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  let counter: number;
  for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsPerUnit);
    if (counter > 0) {
      if (counter === 1) {
        return `${counter} ${unit} ago`;
      } else {
        return `${counter} ${unit}s ago`;
      }
    }
  }
  return "just now";
}
