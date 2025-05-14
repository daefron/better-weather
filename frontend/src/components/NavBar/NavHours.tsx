import Button from "../General/Button.tsx";

interface NavHoursProps {
  amPm: "AM" | "PM";
  setAmPm: (value: "AM" | "PM") => void;
  selectedHour: number;
  setSelectedHour: (hour: number) => void;
  useHours: boolean;
  changeLayout: boolean;
}

export default function NavHours({
  amPm,
  setAmPm,
  selectedHour,
  setSelectedHour,
  useHours,
  changeLayout,
}: NavHoursProps) {
  if (!amPm && !changeLayout) {
    return;
  }
  const hours: number[] = [];
  for (let i = 0; i < 24; i++) {
    if (i === 0) {
      hours.push(12);
    } else if (i === 12) {
      hours.push(12);
    } else {
      hours.push(i % 12);
    }
  }
  return (
    <>
      {hours.map((hour, i) => {
        if ((amPm === "AM" && i > 11) || (amPm === "PM" && i < 12)) {
          return;
        }
        return (
          <Button
            key={i + "hour"}
            content={hour}
            active={useHours && i === Math.ceil(selectedHour % 24)}
            style={{
              display: "block",
              flexGrow: 1,
              fontSize: "clamp(14px, 4vw, 18px)",
            }}
            onClick={() => {
              if (!useHours) return;
              const diff = (selectedHour % 24) - i;
              const final = selectedHour - diff;
              setSelectedHour(final);
            }}
          />
        );
      })}
      <Button
        style={{
          display: "block",
          flexGrow: 1,
          fontSize: "clamp(11px,4vw,17px)",
        }}
        active={amPm === "PM"}
        content={amPm}
        onClick={() => {
          setSelectedHour(selectedHour + (amPm === "AM" ? 12 : -12));
          setAmPm(amPm === "AM" ? "PM" : "AM");
        }}
      />
    </>
  );
}
