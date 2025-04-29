export default function WeatherDate({
  date,
  index,
  activeDate,
  setActiveDate,
  currentType,
}) {
  const options = { weekday: "short" };
  const renderDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(date.date)
  );
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    flexGrow: 1,
    padding: 5,
    fontSize: 13,
    borderRight: "2px solid RGBA(0,0,0,0.1)",
  };
  if (index === 6) {
    style.borderRight = "none";
  }
  if (index === activeDate) {
    style.backgroundColor = "RGBA(255,255,255,0.2)";
  }

  let content;
  switch (currentType) {
    case "temp":
      content = `${date.tempMax}°C`
      break;
    case "rain":
      content = `${date.rainChance}%`
      break;
  }

  return (
    <div style={style} onClick={() => setActiveDate(index)}>
      <p>{content}</p>
      <p>{renderDate}</p>
    </div>
  );
}
