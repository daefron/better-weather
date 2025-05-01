import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useWeatherState } from "../../hooks/WeatherContext";

export default function List() {
  const { showList, setShowList, mapData, selectedHour, viewType } =
    useWeatherState();

  const sortedData = [...mapData]
    .map((place) => ({
      suburb: place.suburb,
      temp: place.hours[selectedHour].temp,
      rain: place.hours[selectedHour].rainChance,
    }))
    .sort((a, b) => b[viewType] - a[viewType]);

    return (
    <div
      style={{
        display: "flex",
        height: "calc(100% - 2px)",
        position: "relative",
        width: "min(90vw, 450px)",
        marginRight: "max(-90vw, -452px)",
        right: showList ? "min(90vw, 450px)" : 0,
        transition: "right 1s ease",
        flexGrow: 1,
        backgroundColor: "rgba(31,53,42,1)",
        border: "outset 2px black",
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 10,
        }}
      >
        <p>{viewType}</p>
        {sortedData.map((place, i) => {
          let symbol;
          switch (viewType) {
            case "temp":
              symbol = "°C";
              break;
            case "rainChance":
              symbol = "%";
              break;
          }
          return (
            <div key={"suburbList" + i} style={{ display: "flex" }}>
              <p>
                {i + 1}. {place.suburb} {place[viewType]}
                {symbol}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
