import { useRef } from "react";
export default function NavHours({
  amPm,
  setAmPm,
  selectedHour,
  setSelectedHour,
  useHours,
  changeLayout,
}) {
  if (!amPm) {
    if (!changeLayout) return;
  }
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push((i % 12) + 1);
  }
  return (
    <>
      {hours.map((hour, i) => {
        if ((amPm === "AM" && i > 11) || (amPm === "PM" && i < 12)) {
          return;
        }
        const style = {
          height: 30,
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
          border: "1px outset black",
          userSelect: "none",
        };
        if (useHours && i === Math.ceil(selectedHour % 24)) {
          style.backgroundColor = "rgb(25,45,35)";
          style.border = "1px inset black";
        }
        return (
          <div
            key={i + "hour"}
            style={style}
            onClick={() => {
              if (!useHours) return;
              const diff = (selectedHour % 24) - i;
              const final = selectedHour - diff;
              setSelectedHour(final);
            }}
          >
            <p>{hour}</p>
          </div>
        );
      })}
      <button
        style={{ flexGrow: 1, fontSize: 20, height: 32 }}
        onClick={() => {
          if (amPm === "AM") {
            setSelectedHour(selectedHour + 12);
          } else {
            setSelectedHour(selectedHour - 12);
          }
          setAmPm(amPm === "AM" ? "PM" : "AM");
        }}
      >
        {amPm}
      </button>
    </>
  );
}
