import NavStats from "./NavStats";
import NavDates from "./NavDates";
import NavHours from "./NavHours";
export default function NavBar({
  centerPoint,
  activeHour,
  setActiveHour,
  AMPM,
  setAMPM,
  mapData,
  currentType,
}) {
  return (
    <div id="navBar">
      <NavStats centerPoint={centerPoint} activeHour={activeHour} AMPM={AMPM} />
      <NavHours
        AMPM={AMPM}
        setAMPM={setAMPM}
        activeHour={activeHour}
        setActiveHour={setActiveHour}
      />
      <NavDates
        mapData={mapData}
        currentType={currentType}
        activeHour={activeHour}
        setActiveHour={setActiveHour}
      />
    </div>
  );
}
