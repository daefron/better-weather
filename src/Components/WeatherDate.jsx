export default function WeatherDate(date) {
  const temp = date.date.tempMax;
  const options = { weekday: "short" };
  const renderDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date.date.date)
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        margin: 10,
      }}
    >
      <p>{temp}°C</p>
      <p>{renderDate}</p>
    </div>
  );
}
