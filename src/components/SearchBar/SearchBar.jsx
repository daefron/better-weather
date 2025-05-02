import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useWeatherState } from "../../hooks/WeatherContext";
export default function SearchBar() {
  const {
    changeLayout,
    userSubmit,
    setLocationInput,
    errorMessage,
    loading,
    inputRef,
    unitType,
    setUnitType,
    resetLayout,
  } = useWeatherState();

  function tempRainSwitch(e) {
    e.preventDefault();
    switch (unitType) {
      case "temp":
        setUnitType("rainChance");
        break;
      case "rainChance":
        setUnitType("windMax");
        break;
      case "windMax":
        setUnitType("temp");
        break;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: changeLayout ? "row" : "column",
        marginInline: changeLayout ? 0 : 15,
        marginBlock: changeLayout ? 0 : 10,
      }}
    >
      <form
        onSubmit={userSubmit}
        style={{
          width: changeLayout ? 0 : "calc(100%)",
          flexGrow: 8,
          position: "relative",
        }}
      >
        <input
          type="text"
          id="userLocation"
          style={{ width: "calc(100% - 10px)", fontSize: 18, padding: 4 }}
          onChange={(e) => {
            setLocationInput(e.target.value);
          }}
          onFocus={() => {
            if (changeLayout) {
              resetLayout();
            }
          }}
          ref={inputRef}
          placeholder="Search for a location"
        ></input>
        <FontAwesomeIcon
          icon={faSearch}
          onClick={(e) => {
            userSubmit(e);
          }}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#888",
            cursor: "pointer",
          }}
        />
      </form>
      {changeLayout ? null : loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <BarLoader width="80%" height={5} color="#dcfff9" />
        </div>
      ) : errorMessage ? (
        <p
          style={{
            textAlign: "center",
            textDecoration: "underline",
            fontWeight: "bold",
            marginBottom: -10,
            marginTop: 10,
          }}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
