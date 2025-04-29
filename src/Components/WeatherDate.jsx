export default function WeatherDate({
  date,
  index,
  activeDate,
  setActiveDate,
}) {
  const temp = date.tempMax;
  const options = { weekday: "short" };
  const renderDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date.date)
  );
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    padding: 10,
  };
  if (index === activeDate) {
    style.backgroundColor = "RGBA(255,255,255,0.2)";
  }
  return (
    <div style={style} onClick={() => setActiveDate(index)}>
      <p>{temp}°C</p>
      <p>{renderDate}</p>
    </div>
  );
}
