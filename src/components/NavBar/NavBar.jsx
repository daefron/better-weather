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
    useHours,
    setUseHours,
  } = useWeatherState();
  return (
    <div id="navBar">
      <NavHours
        amPm={amPm}
        setAmPm={setAmPm}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
        useHours={useHours}
      />
      <NavDates
        mapData={mapData}
        unitType={unitType}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
        setUseHours={setUseHours}
        useHours={useHours}
      />
      <NavStats
        centerPoint={centerPoint}
        selectedHour={selectedHour}
        amPm={amPm}
        useHours={useHours}
      />
    </div>
  );
}
