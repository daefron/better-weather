import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useWeatherState } from "../../hooks/WeatherContext";
export default function SearchBar() {
  const {
    changeLayout,
    userSubmit,
    setLocationInput,
    setChangeLayout,
    errorMessage,
    loading,
    inputRef,
    viewType,
    setViewType,
    setShowMap,
  } = useWeatherState();

  function tempRainSwitch(e) {
    e.preventDefault();
    switch (viewType) {
      case "temp":
        setViewType("rain");
        break;
      case "rain":
        setViewType("temp");
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
          width: changeLayout ? 0 : "100%",
          flexGrow: 8,
          position: "relative",
        }}
      >
        <input
          type="text"
          id="userLocation"
          style={{ width: "100%", fontSize: 18, padding: 4 }}
          onChange={(e) => {
            setLocationInput(e.target.value);
          }}
          ref={inputRef}
          placeholder="Search for a location"
        ></input>
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#888",
          }}
        />
      </form>
      {changeLayout ? (
        <>
          <button
            style={{ fontSize: 16, flexGrow: 1 }}
            onClick={tempRainSwitch}
          >
            Temp/Rain
          </button>
          <button
            style={{ fontSize: 16, flexGrow: 1 }}
            onClick={() => {
              setChangeLayout(false);
              setShowMap(false);
            }}
          >
            Settings
          </button>
        </>
      ) : loading ? (
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
