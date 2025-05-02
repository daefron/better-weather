export default function NavHours({
  amPm,
  setAmPm,
  selectedHour,
  setSelectedHour,
  useHours,
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
        height: useHours ? 34 : 3,
        position: "relative",
        zIndex: 1,
        transition: "height 1s ease",
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
        if (useHours && i === Math.ceil(selectedHour % 24)) {
          style.backgroundColor = "RGBA(255,255,255,0.2)";
          style.border = "1px inset RGBA(0,0,0,1)"
        }
        return (
          <div
            key={i + "hour"}
            style={style}
            onClick={() => {
              if (!useHours) return;
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
        style={{ flexGrow: 1, fontSize: 20, height: 32 }}
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
