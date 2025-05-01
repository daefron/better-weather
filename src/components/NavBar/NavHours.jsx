export default function NavHours({ AMPM, setAMPM, activeHour, setActiveHour }) {
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
        if ((AMPM === "AM" && i > 11) || (AMPM === "PM" && i < 12)) {
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
        if (i === Math.ceil(activeHour % 24)) {
          style.backgroundColor = "RGBA(255,255,255,0.2)";
        }
        return (
          <div
            key={i + "hour"}
            style={style}
            onClick={() => {
              const diff = (activeHour % 24) - i;
              const final = activeHour - diff;
              setActiveHour(final);
            }}
          >
            <p>{hour}</p>
          </div>
        );
      })}
      <button
        style={{ fontSize: 20 }}
        onClick={() => {
          if (AMPM === "AM") {
            setActiveHour(activeHour + 12);
          } else {
            setActiveHour(activeHour - 12);
          }
          setAMPM(AMPM === "AM" ? "PM" : "AM");
        }}
      >
        {AMPM}
      </button>
    </div>
  );
}
