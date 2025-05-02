import { useWeatherState } from "../../hooks/WeatherContext";
export default function Settings() {
  const { radiusKMInput, setRadiusKMInput, changeLayout, loading } =
    useWeatherState();
  return (
    <div
      id="inputs"
      style={{
        width: "auto",
        marginBlock: !changeLayout ? 10 : 0,
        marginInline: !changeLayout ? 15: 0,
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
              gap: 10,
            }}
          >
            <label htmlFor="searchRadius">
              Search radius: {`${radiusKMInput}km`}
            </label>
            <input
              type="range"
              id="searchRadius"
              style={{ flexGrow: 1 }}
              min="25"
              max="200"
              step="1"
              value={radiusKMInput}
              onChange={(e) => setRadiusKMInput(e.target.value)}
            ></input>
          </form>
        </>
      ) : null}
    </div>
  );
}
