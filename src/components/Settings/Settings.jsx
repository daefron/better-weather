import { useWeatherState } from "../../hooks/WeatherContext";
export default function Settings() {
  const { radiusKMInput, setRadiusKMInput, changeLayout, loading } =
    useWeatherState();

  const radiusOptions = [25, 50, 75, 100, 125, 150];

  return (
    <div
      id="inputs"
      style={{
        width: "auto",
        marginBlock: !changeLayout ? 10 : 0,
        marginInline: !changeLayout ? 15 : 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {changeLayout ? null : !loading ? (
        <>
          <form
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
            onChange={(e) => setRadiusKMInput(e.target.value)}
          >
            <label htmlFor="searchRadius">Search radius (km):</label>
            {radiusOptions.map((option) => {
              return (
                <button
                  key={"radiusOption" + option}
                  style={{
                    flexGrow: 1,
                    paddingBlock: 3,
                    background:
                      radiusKMInput === option
                        ? "rgb(52,105,78)"
                        : "rgb(41,70,55)",
                    border:
                      radiusKMInput === option
                        ? "2px inset black"
                        : "2px outset black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRadiusKMInput(option);
                  }}
                >
                  {option}
                </button>
              );
            })}
          </form>
        </>
      ) : null}
    </div>
  );
}
