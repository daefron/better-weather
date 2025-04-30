export default function WeatherDate({
  date,
  index,
  activeHour,
  setActiveHour,
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
  if (index === 7) {
    style.borderRight = "none";
  }
  if (index === Math.ceil((activeHour + 1) / 24)) {
    style.backgroundColor = "RGBA(255,255,255,0.2)";
  }

  let content;
  switch (currentType) {
    case "temp":
      content = `${date.tempMax}°C`;
      break;
    case "rain":
      content = `${date.rainChance}%`;
      break;
  }

  return (
    <div
      style={style}
      onClick={() => {
        const diff = 24 - (activeHour % 24);
        const final = index * 24 - diff;
        setActiveHour(final);
      }}
    >
      <p>{content}</p>
      <p>{renderDate}</p>
    </div>
  );
}
