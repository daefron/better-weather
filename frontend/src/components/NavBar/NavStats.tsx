import Button from "../General/Button.tsx";

interface NavStatsProps {
  userPoint: any;
  selectedHour: number;
  amPm: "AM" | "PM";
  useHours: boolean;
  changeLayout: boolean;
  unitType: "temp" | "rainChance" | "windMax";
  setUnitType: (unitType: "temp" | "rainChance" | "windMax") => void;
  tempUnit: "C" | "F";
  dateFormat: "DD/MM" | "MM/DD";
}

export default function NavStats({
  userPoint,
  selectedHour,
  amPm,
  useHours,
  changeLayout,
  unitType,
  setUnitType,
  tempUnit,
  dateFormat,
}: NavStatsProps) {
  if (!changeLayout) return null;

  const dateIndex = Math.floor(selectedHour / 24);
  const date = new Date(userPoint.dates[dateIndex].date);

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
    ? userPoint.hours[selectedHour]
    : userPoint.dates[Math.floor(selectedHour / 24)];
  const tempContent = `Temp - ${valueSource.temp}°${tempUnit}`;
  const rainContent = `Rain - ${valueSource.rainChance}%`;
  const windContent = `Wind - ${valueSource.windMax} km/h`;

  return (
    <>
      <div
        style={{
          fontSize: "clamp(10px, 3vw, 15px)",
          backgroundColor: "rgb(32, 53, 42)",
          border: "1px outset black",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          height: "calc(100% + 10px)",
          flexGrow: 1,
        }}
      >
        <p style={{ paddingInline: "6px" }}>{dateTimeContent}</p>
      </div>
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "temp"}
        content={tempContent}
        onClick={() => {
          setUnitType("temp");
        }}
      />
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "rainChance"}
        content={rainContent}
        onClick={() => {
          setUnitType("rainChance");
        }}
      />
      <Button
        style={{
          height: "calc(100% + 12px)",
        }}
        active={unitType === "windMax"}
        content={windContent}
        onClick={() => {
          setUnitType("windMax");
        }}
      />
    </>
  );
}
