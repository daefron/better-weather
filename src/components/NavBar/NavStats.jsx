import { useRef } from "react";
import Button from "../General/Button";
export default function NavStats({
  centerPoint,
  selectedHour,
  amPm,
  useHours,
  changeLayout,
  unitType,
  setUnitType,
  tempUnit,
  dateFormat,
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
  const dateContent = new Intl.DateTimeFormat(
    dateFormat === "DD/MM" ? "en-AU" : "en-US",
    {
      day: "numeric",
      month: "numeric",
    }
  ).format(date);
  const timeContent = useHours
    ? selectedHour % 12 !== 0
      ? " - " + (selectedHour % 12) + " " + amPm
      : " - " + 12 + amPm
    : "";
  const dateTimeContent = weekdayContent + " " + dateContent + timeContent;

  const valueSource = useHours
    ? centerPoint.hours[selectedHour]
    : centerPoint.dates[Math.floor(selectedHour / 24)];
  const tempContent = "Temp - " + valueSource.temp + "°" + tempUnit;
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
      <Button
        style={{
          alignItems: "start",
          height: "calc(100% + 12px)",
          flexGrow: 1,
        }}
        content={contentRef.current.dateTime}
      />
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "temp"}
        content={contentRef.current.temp}
        onClick={(e) => {
          e.preventDefault();
          setUnitType("temp");
        }}
      />
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "rainChance"}
        content={contentRef.current.rain}
        onClick={(e) => {
          e.preventDefault();
          setUnitType("rainChance");
        }}
      />
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "windMax"}
        content={contentRef.current.wind}
        onClick={(e) => {
          e.preventDefault();
          setUnitType("windMax");
        }}
      />
    </>
  );
}
