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
    viewType,
  } = useWeatherState();
  return (
    <div id="navBar">
      <NavStats centerPoint={centerPoint} selectedHour={selectedHour} amPm={amPm} />
      <NavHours
        amPm={amPm}
        setAmPm={setAmPm}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />
      <NavDates
        mapData={mapData}
        viewType={viewType}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />
    </div>
  );
}
