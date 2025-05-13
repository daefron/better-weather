import { useWeatherState } from "../../hooks/WeatherContext";
import Button from "../General/Button";
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
    dateFormat,
    setDateFormat,
  } = useWeatherState();

  const radiusOptions = [25, 50, 75, 100, 125];
  const densityOptions = [1, 2, 4, 8];
  const tempUnitOptions = ["C", "F"];
  const dateFormatOptions = ["DD/MM", "MM/DD"];

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
            <p
              style={{
                flexGrow: 1,
                fontSize: "clamp(12px, 4vw, 16px)",
                textWrap: "nowrap",
              }}
            >
              Search radius (km):
            </p>
            {radiusOptions.map((option) => {
              return (
                <Button
                  key={"radiusOption" + option}
                  active={radiusKMInput === option}
                  content={option}
                  style={{
                    width: "10%",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRadiusKMInput(option);
                  }}
                />
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
            <p
              style={{
                flexGrow: 1,
                fontSize: "clamp(12px, 4vw, 16px)",
                textWrap: "nowrap",
              }}
            >
              Result density:
            </p>
            {densityOptions.map((option) => {
              return (
                <Button
                  key={"radiusDensityOption" + option}
                  active={radiusDensity === option}
                  content={option}
                  style={{
                    width: "10%",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRadiusDensity(option);
                  }}
                />
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
            <p
              style={{
                flexGrow: 1,
                fontSize: "clamp(12px, 4vw, 16px)",
                textWrap: "nowrap",
              }}
            >
              Temperature unit:
            </p>
            {tempUnitOptions.map((option) => {
              return (
                <Button
                  key={"tempOption" + option}
                  active={tempUnit === option}
                  content={"°" + option}
                  style={{
                    width: "10%",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTempUnit(option);
                  }}
                />
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
            <p
              style={{
                flexGrow: 1,
                fontSize: "clamp(12px, 4vw, 16px)",
                textWrap: "nowrap",
              }}
            >
              Date format:
            </p>
            {dateFormatOptions.map((option) => {
              return (
                <Button
                  key={"dateFormatOption" + option}
                  active={dateFormat === option}
                  content={option}
                  onClick={(e) => {
                    e.preventDefault();
                    setDateFormat(option);
                  }}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
