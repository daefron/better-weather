import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMap,
} from "@fortawesome/free-solid-svg-icons";

import { useWeatherState } from "../../hooks/WeatherContext";

export default function List() {
  const {
    showList,
    setShowList,
    mapData,
    selectedHour,
    useHours,
    unitType,
    centerPoint,
    selectedLocation,
    setSelectedLocation,
    tempUnit,
  } = useWeatherState();

  const sortedData = [...mapData]
    .map((place, i) => {
      const dataSource = useHours
        ? place.hours[selectedHour]
        : place.dates[Math.floor(selectedHour / 24)];
      const url = new URL(
        `https://www.google.com/maps/place/${place.suburb},${place.latitude},${place.longitude}`
      );
      if (!i) {
        return {
          suburb: place.suburb,
          temp: dataSource.temp,
          rainChance: dataSource.rainChance,
          windMax: dataSource.windMax,
          distance: place.distance,
          chosenLocation: true,
          url: url,
          index: i,
        };
      }
      return {
        suburb: place.suburb,
        temp: dataSource.temp,
        rainChance: dataSource.rainChance,
        windMax: dataSource.windMax,
        distance: place.distance,
        url: url,
        index: i,
      };
    })
    .sort((a, b) => b[unitType] - a[unitType]);

  let symbol;
  switch (unitType) {
    case "temp":
      symbol = "°" + tempUnit;
      break;
    case "rainChance":
      symbol = "%";
      break;
    case "windMax":
      symbol = "km/h";
      break;
  }

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        height: "calc(100% - 2px)",
        maxHeight: "max(70%, 500px)",
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
            color: "#affff",
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
            place[unitType] -
            (useHours
              ? centerPoint.hours[selectedHour][unitType]
              : centerPoint.dates[Math.floor(selectedHour / 24)][unitType])
          ).toFixed(1);
          return (
            <div
              key={"suburbList" + i}
              style={{
                border: "solid 4px rgba(0,0,0,0.13)",
                borderInline: " solid 10px rgba(0,0,0,0.13)",
                padding: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              <p>{place.distance.toFixed(1)} km</p>
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
              <a href={place.url} target="_blank">
                <FontAwesomeIcon
                  icon={faMap}
                  style={{
                    color: "#affff",
                    height: 18,
                  }}
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
