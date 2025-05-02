export default function NavStats({ centerPoint, selectedHour, amPm }) {
  const dateIndex = Math.floor(selectedHour / 24);
  const date = new Date(centerPoint.dates[dateIndex].date);
  const weekdayContent = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
  }).format(date);
  const dateContent = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "numeric",
  }).format(date);
  const timeContent =
    selectedHour % 12 !== 11
      ? ((selectedHour + 1) % 12) + " " + amPm
      : 12 + (amPm === "AM" ? "PM" : "AM");
  const dateTimeContent =
    weekdayContent + " " + dateContent + " - " + timeContent;

  const hourCache = centerPoint.hours[selectedHour];
  const tempContent = hourCache.temp + "°C";
  const rainContent = hourCache.rainChance + "% rain";
  const windContent = hourCache.windMax + "km/h";
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        border: "outset 1px black",
        boxSizing: "border-box",
        paddingInline: 10,
        paddingBlock: 5,
        fontSize: 16,
      }}
    >
      <p style={{ flexGrow: 1 }}>{dateTimeContent}</p>
      <p>{tempContent}</p>
      <p>{rainContent}</p>
      <p>{windContent}</p>
    </div>
  );
}
