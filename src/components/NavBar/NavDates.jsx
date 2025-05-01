export default function NavDates({
  mapData,
  currentType,
  activeHour,
  setActiveHour,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px outset RGBA(0,0,0,1)",
      }}
    >
      {mapData[0].dates.map((date, index) => {
        index+= 1
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
          paddingBlock: 5,
          fontSize: 15,
          border: "1px outset RGBA(0,0,0,1)",
        };
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
            key={"navDate" + index}
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
      })}
    </div>
  );
}
