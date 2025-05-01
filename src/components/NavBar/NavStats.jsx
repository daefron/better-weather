export default function NavStats({ centerPoint, selectedHour, amPm }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        boxSizing: "border-box",
        paddingInline: 10,
        paddingBlock: 5,
        fontSize: 16,
      }}
    >
      <p style={{ flexGrow: 1 }}>
        {new Intl.DateTimeFormat("en-US", {
          weekday: "short",
        }).format(
          new Date(centerPoint.dates[Math.floor(selectedHour / 24)].date)
        )}{" "}
        {new Intl.DateTimeFormat("en-AU", {
          day: "numeric",
          month: "numeric",
        }).format(
          new Date(centerPoint.dates[Math.floor(selectedHour / 24)].date)
        )}{" "}
        -{" "}
        {selectedHour % 12 !== 11
          ? ((selectedHour + 1) % 12) + " " + amPm
          : 12 + (amPm === "AM" ? "PM" : "AM")}
      </p>
      <p>{centerPoint.hours[selectedHour].temp}°C</p>
      <p>{centerPoint.hours[selectedHour].rainChance}% rain</p>
      <p>{centerPoint.hours[selectedHour].windMax}km/h</p>
    </div>
  );
}
