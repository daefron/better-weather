export default function NavHours({
  amPm,
  setAmPm,
  selectedHour,
  setSelectedHour,
}) {
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push((i % 12) + 1);
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        boxSizing: "border-box",
        border: "1px outset RGBA(0,0,0,1)",
      }}
    >
      {hours.map((hour, i) => {
        if ((amPm === "AM" && i > 11) || (amPm === "PM" && i < 12)) {
          return;
        }
        const style = {
          height: 30,
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
          border: "1px outset RGBA(0,0,0,1)",
          userSelect: "none",
        };
        if (i === Math.ceil(selectedHour % 24)) {
          style.backgroundColor = "RGBA(255,255,255,0.2)";
        }
        return (
          <div
            key={i + "hour"}
            style={style}
            onClick={() => {
              const diff = (selectedHour % 24) - i;
              const final = selectedHour - diff;
              setSelectedHour(final);
            }}
          >
            <p>{hour}</p>
          </div>
        );
      })}
      <button
        style={{ flexGrow: 1, fontSize: 20 }}
        onClick={() => {
          if (amPm === "AM") {
            setSelectedHour(selectedHour + 12);
          } else {
            setSelectedHour(selectedHour - 12);
          }
          setAmPm(amPm === "AM" ? "PM" : "AM");
        }}
      >
        {amPm}
      </button>
    </div>
  );
}
