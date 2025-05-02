import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useWeatherState } from "../../hooks/WeatherContext";

export default function List() {
  const {
    showList,
    setShowList,
    mapData,
    selectedHour,
    unitType,
    centerPoint,
    selectedLocation,
    setSelectedLocation,
  } = useWeatherState();

  const sortedData = [...mapData]
    .map((place, i) => {
      if (!i) {
        return {
          suburb: place.suburb,
          temp: place.hours[selectedHour].temp,
          rainChance: place.hours[selectedHour].rainChance,
          chosenLocation: true,
          index: i,
        };
      }
      return {
        suburb: place.suburb,
        temp: place.hours[selectedHour].temp,
        rainChance: place.hours[selectedHour].rainChance,
        index: i,
      };
    })
    .sort((a, b) => b[unitType] - a[unitType]);

  let symbol;
  switch (unitType) {
    case "temp":
      symbol = "°C";
      break;
    case "rainChance":
      symbol = "%";
      break;
  }

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        height: "calc(100% - 2px)",
        maxHeight: "max(70vh, 500px)",
        position: "relative",
        width: "min(90vw, 450px)",
        marginRight: "max(calc(-90vw - 2px), -452px)",
        right: showList ? "min(90vw, 450px)" : 0,
        transition: "right 1s ease",
        flexGrow: 1,
        backgroundColor: "rgba(31,53,42,1)",
        border: "outset 2px black",
        borderRight: "none",
        zIndex: 50,
      }}
    >
      <button
        style={{
          width: 30,
          marginLeft: "-30px",
          height: 80,
          alignSelf: "center",
          zIndex: 100,
          borderRight: "none",
        }}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        <FontAwesomeIcon
          icon={showList ? faChevronRight : faChevronLeft}
          style={{
            pointerEvents: "none",
            color: "#dcfff9",
            height: 20,
          }}
        />
      </button>
      <div
        id="suburbList"
        style={{
          overflowY: "scroll",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.13)",
          paddingTop: 5,
        }}
      >
        {sortedData.map((place, i) => {
          const diffToChosen = (
            place[unitType] - centerPoint.hours[selectedHour][unitType]
          ).toFixed(1);
          return (
            <div
              key={"suburbList" + i}
              style={{
                border: "solid 4px rgba(0,0,0,0.13)",
                borderInline: " solid 10px rgba(0,0,0,0.13)",
                paddingInline: 5,
                paddingBlock: 1,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 18,
                fontWeight: place.chosenLocation ? "bold" : "normal",
                textDecoration:
                  place.index === selectedLocation ? "underline" : "none",
                gap: 10,
                cursor: "pointer",
                boxSizing: "border-box",
                backgroundColor: "rgb(31, 53, 42)",
              }}
              onClick={() => setSelectedLocation(place.index)}
            >
              <p style={{ flexGrow: 1 }}>
                {i + 1}.{" "}
                {place.chosenLocation ? centerPoint.suburb : place.suburb}
              </p>
              <p>
                {place[unitType]}
                {symbol}
              </p>
              <p>
                {!place.chosenLocation
                  ? diffToChosen >= 0
                    ? `+${diffToChosen}`
                    : diffToChosen
                  : diffToChosen}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
