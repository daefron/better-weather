import NavStats from "./NavStats";
import NavDates from "./NavDates";
import NavHours from "./NavHours";
import { useWeatherState } from "../../hooks/WeatherContext";
export default function NavBar() {
  const {
    centerPoint,
    selectedHour,
    setSelectedHour,
    amPm,
    setAmPm,
    mapData,
    unitType,
    setUnitType,
    useHours,
    setUseHours,
    changeLayout,
  } = useWeatherState();
  return (
    <div
      id="navBar"
      style={{
        maxHeight: changeLayout ? 500 : 0,
        transition: "all 1s linear",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          border: changeLayout ? "1px outset RGBA(0,0,0,1)" : "none",
          height: useHours ? 34 : 3,
          position: "relative",
          zIndex: 1,
          transition: "all 0.5s linear",
        }}
      >
        <NavHours
          amPm={amPm}
          setAmPm={setAmPm}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          useHours={useHours}
          changeLayout={changeLayout}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "rgba(32,53,42,1)",
          border: changeLayout ? "1px outset RGBA(0,0,0,1)" : "none",
          position: "relative",
          zIndex: 10,
          height: changeLayout ? 51 : 0,
          transition: "all 0.7s linear",
        }}
      >
        <NavDates
          mapData={mapData}
          unitType={unitType}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          setUseHours={setUseHours}
          useHours={useHours}
          changeLayout={changeLayout}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(32,53,42,1)",
          position: "relative",
          zIndex: 11,
          border: changeLayout ? "outset 1px black" : "none",
          boxSizing: "border-box",
          paddingLeft: 10,
          paddingBlock: changeLayout ? 5 : 0,
          fontSize: 16,
          height: changeLayout ? 30 : 0,
          transition: "all 0.5s linear, padding 0s",
        }}
      >
        <NavStats
          centerPoint={centerPoint}
          selectedHour={selectedHour}
          amPm={amPm}
          useHours={useHours}
          changeLayout={changeLayout}
          unitType={unitType}
          setUnitType={setUnitType}
        />
      </div>
    </div>
  );
}
