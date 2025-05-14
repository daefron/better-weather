import NavStats from "./NavStats";
import NavDates from "./NavDates";
import NavHours from "./NavHours";
import { useWeatherState } from "../../hooks/WeatherContext";

export default function NavBar() {
  const {
    userPoint,
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
    tempUnit,
    dateFormat,
  } = useWeatherState();
  return (
    <div
      id="navBar"
      style={{
        maxHeight: changeLayout ? 500 : 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          border: "1px outset black",
          height: useHours ? 34 : 3,
          position: "relative",
          zIndex: 9,
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
          border: "1px outset black",
          position: "relative",
          zIndex: 10,
          marginBottom: 1,
          height: 51,
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
          tempUnit={tempUnit}
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
          boxSizing: "border-box",
          paddingBlock: 5,
          fontSize: 16,
          height: 30,
        }}
      >
        <NavStats
          userPoint={userPoint}
          selectedHour={selectedHour}
          amPm={amPm}
          useHours={useHours}
          changeLayout={changeLayout}
          unitType={unitType}
          setUnitType={setUnitType}
          tempUnit={tempUnit}
          dateFormat={dateFormat}
        />
      </div>
    </div>
  );
}
