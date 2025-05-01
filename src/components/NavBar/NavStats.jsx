export default function NavStats({ centerPoint, activeHour, AMPM }) {
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
          new Date(centerPoint.dates[Math.floor(activeHour / 24)].date)
        )}{" "}
        {new Intl.DateTimeFormat("en-AU", {
          day: "numeric",
          month: "numeric",
        }).format(
          new Date(centerPoint.dates[Math.floor(activeHour / 24)].date)
        )}{" "}
        -{" "}
        {activeHour % 12 !== 11
          ? ((activeHour + 1) % 12) + " " + AMPM
          : 12 + (AMPM === "AM" ? "PM" : "AM")}
      </p>
      <p>{centerPoint.hours[activeHour].temp}°C</p>
      <p>{centerPoint.hours[activeHour].rainChance}% rain</p>
      <p>{centerPoint.hours[activeHour].windMax}km/h</p>
    </div>
  );
}
