import { useWeatherState } from "../../hooks/WeatherContext";
export default function Settings() {
  const {
    radiusKMInput,
    setRadiusKMInput,
    changeLayout,
    loading,
    radiusDensity,
    setRadiusDensity,
    tempUnit,
    setTempUnit,
  } = useWeatherState();

  const radiusOptions = [25, 50, 75, 100, 125, 150];
  const densityOptions = [1, 2, 4, 8];
  const tempUnitOptions = ["C", "F"];

  return (
    <div
      id="inputs"
      style={{
        width: "auto",
        marginBlock: !changeLayout ? 10 : 0,
        marginInline: !changeLayout ? 15 : 0,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {changeLayout ? null : !loading ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <p style={{ flexGrow: 1 }}>Search radius (km):</p>
            {radiusOptions.map((option) => {
              return (
                <button
                  key={"radiusOption" + option}
                  style={{
                    width: "10%",
                    paddingBlock: 3,
                    background:
                      radiusKMInput === option
                        ? "rgb(25,45,35)"
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
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <p style={{ flexGrow: 1 }}>Result density:</p>
            {densityOptions.map((option) => {
              return (
                <button
                  key={"densityOption" + option}
                  style={{
                    width: "10%",
                    paddingBlock: 3,
                    background:
                      radiusDensity === option
                        ? "rgb(25,45,35)"
                        : "rgb(41,70,55)",
                    border:
                      radiusDensity === option
                        ? "2px inset black"
                        : "2px outset black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRadiusDensity(option);
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <p style={{ flexGrow: 1 }}>Temperature unit:</p>
            {tempUnitOptions.map((option) => {
              return (
                <button
                  key={"densityOption" + option}
                  style={{
                    width: "10%",
                    paddingBlock: 3,
                    background:
                      tempUnit === option ? "rgb(25,45,35)" : "rgb(41,70,55)",
                    border:
                      tempUnit === option
                        ? "2px inset black"
                        : "2px outset black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTempUnit(option);
                  }}
                >
                  °{option}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
