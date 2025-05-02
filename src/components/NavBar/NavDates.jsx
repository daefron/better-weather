import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";

import { useRef } from "react";

export default function NavDates({
  mapData,
  unitType,
  selectedHour,
  setSelectedHour,
  setUseHours,
  useHours,
  changeLayout,
}) {
  const contentRef = useRef();

  if (!contentRef.current) {
    if (!changeLayout) return;
  }
  contentRef.current = mapData;
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "10%",
          minWidth: 30,
          backgroundColor: useHours ? "RGB(25,45,35)" : null,
          border: useHours
            ? "1px inset RGBA(0,0,0,1)"
            : "1px outset RGBA(0,0,0,1)",
        }}
        onClick={() => {
          setUseHours(!useHours);
        }}
      >
        <FontAwesomeIcon
          icon={useHours ? faClock : faCalendar}
          style={{
            width: "clamp(12px,5vw,18px)",
            height: "clamp(12px,5vw,18px)",
            color: "#dcfff9",
            alignSelf: "center",
          }}
        />
      </div>
      {contentRef.current[0].dates.map((date, index) => {
        index += 1;
        const options = { weekday: "short" };
        const renderDate = new Intl.DateTimeFormat("en-US", options).format(
          new Date(date.date)
        );
        const style = {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          flexGrow: 1,
          paddingBlock: 5,
          fontSize: "clamp(10px,3vw,15px)",
          border: "1px outset black",
          textAlign: "center",
        };
        if (index === Math.ceil((selectedHour + 1) / 24)) {
          style.backgroundColor = "RGBA(25,45,35,1)";
          style.border = "1px inset black";
        }

        let content;
        switch (unitType) {
          case "temp":
            content = `${date.temp}°C`;
            break;
          case "rainChance":
            content = `${date.rainChance}%`;
            break;
          case "windMax":
            content = `${date.windMax} km/h`;

            break;
        }

        return (
          <div
            key={"navDate" + index}
            style={style}
            onClick={() => {
              const diff = 24 - (selectedHour % 24);
              const final = index * 24 - diff;
              setSelectedHour(final);
            }}
          >
            <p>{content}</p>
            <p>{renderDate}</p>
          </div>
        );
      })}
    </>
  );
}
