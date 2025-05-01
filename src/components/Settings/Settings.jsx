import { useWeatherState } from "../../hooks/WeatherContext";
export default function Settings() {
  const { radiusInput, setRadiusInput } = useWeatherState();
  return (
    <div
      id="inputs"
      style={{
        width: "auto",
        marginBlock: 10,
        marginInline: 15,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <label htmlFor="searchRadius">
          Search radius: {`${radiusInput}km`}
        </label>
        <input
          type="range"
          id="searchRadius"
          style={{ flexGrow: 1 }}
          min="25"
          max="200"
          step="1"
          value={radiusInput}
          onChange={(e) => setRadiusInput(e.target.value)}
        ></input>
      </form>
    </div>
  );
}
