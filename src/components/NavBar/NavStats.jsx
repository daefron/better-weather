import { useRef } from "react";
export default function NavStats({
  centerPoint,
  selectedHour,
  amPm,
  useHours,
  changeLayout,
  unitType,
  setUnitType,
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
    ? selectedHour % 12 !== 0
      ? " - " + (selectedHour % 12) + " " + amPm
      : " - " + 12 + amPm
    : "";
  const dateTimeContent = weekdayContent + " " + dateContent + timeContent;

  const valueSource = useHours
    ? centerPoint.hours[selectedHour]
    : centerPoint.dates[Math.floor(selectedHour / 24)];
  const tempContent = "Temp - " + valueSource.temp + "°C";
  const rainContent = "Rain - " + valueSource.rainChance + "%";
  const windContent = "Wind - " + valueSource.windMax + "km/h";

  contentRef.current = {
    dateTime: dateTimeContent,
    temp: tempContent,
    rain: rainContent,
    wind: windContent,
  };
  return (
    <>
      <p
        style={{
          height: 30,
          lineHeight: "30px",
          border: "1px outset black",
          paddingInline: "clamp(2px,1vw,5px)",
          fontSize: "clamp(10px, 3.5vw, 16px)",
          backgroundColor: "rgb(31, 53, 42)",
          flexGrow: 1,
        }}
      >
        {contentRef.current.dateTime}
      </p>
      <button
        style={{
          paddingInline: "clamp(2px,1vw,5px)",
          fontSize: "clamp(10px, 3.5vw, 16px)",
          height: "calc(100% + 12px)",
          border: unitType === "temp" ? "1px inset black" : null,
          background: unitType === "temp" ? "rgb(25,45,35)" : null,
        }}
        onClick={(e) => {
          e.preventDefault;
          setUnitType("temp");
        }}
      >
        {contentRef.current.temp}
      </button>
      <button
        style={{
          paddingInline: "clamp(2px,1vw,5px)",
          fontSize: "clamp(10px, 3.5vw, 16px)",
          height: "calc(100% + 12px)",
          border: unitType === "rainChance" ? "1px inset black" : null,
          background: unitType === "rainChance" ? "rgb(25,45,35)" : null,
        }}
        onClick={(e) => {
          e.preventDefault;
          setUnitType("rainChance");
        }}
      >
        {contentRef.current.rain}
      </button>
      <button
        style={{
          paddingInline: "clamp(2px,1vw,5px)",
          fontSize: "clamp(10px, 3.5vw, 16px)",
          height: "calc(100% + 12px)",
          border: unitType === "windMax" ? "1px inset black" : null,
          background: unitType === "windMax" ? "rgb(25,45,35)" : null,
        }}
        onClick={(e) => {
          e.preventDefault;
          setUnitType("windMax");
        }}
      >
        {contentRef.current.wind}
      </button>
    </>
  );
}
