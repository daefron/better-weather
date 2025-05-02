import { useRef } from "react";
export default function NavStats({
  centerPoint,
  selectedHour,
  amPm,
  useHours,
  changeLayout,
  unitType
}) {
  const contentRef = useRef();
  if (!contentRef.current) {
    if (!changeLayout) return;
  }

  const dateIndex = Math.floor(selectedHour / 24);
  const date = new Date(centerPoint.dates[dateIndex].date);
  const weekdayContent = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
  }).format(date);
  const dateContent = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "numeric",
  }).format(date);
  const timeContent = useHours
    ? selectedHour % 12 !== 11
      ? " - " + ((selectedHour + 1) % 12) + " " + amPm
      : " - " + 12 + (amPm === "AM" ? "PM" : "AM")
    : "";
  const dateTimeContent = weekdayContent + " " + dateContent + timeContent;

  const valueSource = useHours
    ? centerPoint.hours[selectedHour]
    : centerPoint.dates[Math.floor(selectedHour / 24)];
  const tempContent = valueSource.temp + "°C";
  const rainContent = valueSource.rainChance + "% rain";
  const windContent = valueSource.windMax + "km/h";

  contentRef.current = {
    dateTime: dateTimeContent,
    temp: tempContent,
    rain: rainContent,
    wind: windContent,
  };
  return (
    <>
      <p style={{ flexGrow: 1 }}>{contentRef.current.dateTime}</p>
      <p style={{ textDecoration: unitType === "temp" ? "underline" : null }}>
        {contentRef.current.temp}
      </p>
      <p
        style={{
          textDecoration: unitType === "rainChance" ? "underline" : null,
        }}
      >
        {contentRef.current.rain}
      </p>
      <p
        style={{ textDecoration: unitType === "windMax" ? "underline" : null }}
      >
        {contentRef.current.wind}
      </p>
    </>
  );
}
