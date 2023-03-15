export default function currentTime(date?: Date) {
  if (date) {
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}${minutes}`;
  } else {
    return new Date()
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/:/g, "");
  }
}
