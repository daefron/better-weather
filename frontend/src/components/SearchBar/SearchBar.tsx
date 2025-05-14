import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { useWeatherState } from "../../hooks/WeatherContext";

export default function SearchBar() {
  const {
    changeLayout,
    userSubmit,
    getUserLocation,
    errorMessage,
    loading,
    inputRef,
    resetLayout,
  } = useWeatherState();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: changeLayout ? "row" : "column",
        marginInline: changeLayout ? 0 : 15,
        marginTop: changeLayout ? 0 : 20,
        marginBottom: changeLayout ? 0 : 5,
        userSelect: "all",
        bottom: changeLayout ? 5 : 0,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userSubmit();
        }}
        style={{
          width: changeLayout ? 0 : "calc(100%)",
          flexGrow: 8,
          position: "relative",
        }}
        onClick={() => {
          if (changeLayout) {
            inputRef.current.disabled = false;
            resetLayout();
          }
        }}
      >
        <input
          type="text"
          id="userLocation"
          style={{
            width: "calc(100% - 12px)",
            fontSize: changeLayout ? "clamp(14px, 4vw, 18px)" : 18,
            padding: 5,
            position: "relative",
            zIndex: changeLayout ? -1 : 1,
            border: changeLayout ? "1px outset black" : null,
            background: changeLayout ? "rgb(32,53,42)" : null,
          }}
          ref={inputRef}
          placeholder="Enter starting location"
          autoFocus
        ></input>
        <FontAwesomeIcon
          icon={faLocation}
          onClick={() => {
            getUserLocation();
          }}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#afffff",
            cursor: "pointer",
            zIndex: changeLayout ? -2 : 2,
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
          <BarLoader width="80%" height={5} color="#afffff" />
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
