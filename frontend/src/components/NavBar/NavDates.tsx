import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";

import Button from "../General/Button.tsx";

import { useRef } from "react";

interface DateData {
  date: string;
  temp: number;
  rainChance: number;
  windMax: number;
}

interface MapDataItem {
  dates: DateData[];
}

interface NavDatesProps {
  mapData: any[];
  unitType: "temp" | "rainChance" | "windMax";
  selectedHour: number;
  setSelectedHour: (selectedHour: number) => void;
  setUseHours: (value: boolean) => void;
  useHours: boolean;
  changeLayout: boolean;
  tempUnit: "C" | "F";
}

export default function NavDates({
  mapData,
  unitType,
  selectedHour,
  setSelectedHour,
  setUseHours,
  useHours,
  changeLayout,
  tempUnit,
}: NavDatesProps) {
  const contentRef = useRef<MapDataItem[] | null>(null);

  if (!contentRef.current) {
    if (!changeLayout) return null;
  }
  contentRef.current = mapData;
  return (
    <>
      <Button
        content={
          <FontAwesomeIcon
            icon={useHours ? faClock : faCalendar}
            style={{
              width: "clamp(12px,5vw,18px)",
              height: "clamp(12px,5vw,18px)",
              color: "#afffff",
              alignSelf: "center",
            }}
          />
        }
        style={{
          display: "flex",
          justifyContent: "center",
          minWidth: 30,
        }}
        active={useHours}
        onClick={() => {
          setUseHours(!useHours);
        }}
      />
      {contentRef.current[0].dates.map((date, index) => {
        index += 1;
        const renderDate = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
        }).format(new Date(date.date));

        let content;
        switch (unitType) {
          case "temp":
            content = `${date.temp}°${tempUnit}`;
            break;
          case "rainChance":
            content = `${date.rainChance}%`;
            break;
          case "windMax":
            content = `${date.windMax} km/h`;

            break;
        }

        return (
          <Button
            key={"navDate" + index}
            content={
              <>
                <p>{content}</p>
                <p>{renderDate}</p>
              </>
            }
            active={index === Math.ceil((selectedHour + 1) / 24)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              paddingInline: 0,
              flexGrow: 1,
            }}
            onClick={() => {
              const diff = 24 - (selectedHour % 24);
              const final = index * 24 - diff;
              setSelectedHour(final);
            }}
          />
        );
      })}
    </>
  );
}
