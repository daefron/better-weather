import "./App.css";
import { useState, useRef, useMemo } from "react";
import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";
import Map from "./Components/Map";
import NavBar from "./Components/NavBar/NavBar";

function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(50); //coordinate distance between circles in km
  const radiusRings = Math.round(radiusInput / 10);
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [changeLayout, setChangeLayout] = useState(false);
  const [renderMap, setRenderMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centerPoint, setCenterPoint] = useState();
  const [activeHour, setActiveHour] = useState(8);
  const [currentType, setCurrentType] = useState("temp");
  const inputRef = useRef();
  const radiusKM = useMemo(() => radiusInput / 554, [radiusInput]);
  const [AMPM, setAMPM] = useState("AM");
  const [errorMessage, setErrorMessage] = useState();
  const [listMap, setListMap] = useState("Map");

  async function userSubmit(e) {
    e.preventDefault();

    //prevents multiple requests
    if (loading) {
      return;
    }

    setLoading(true);
    setRenderMap(false);

    try {
      const fetchError = new Error("No results found for this location.");
      const inputData = await fetchCoords(locationInput);
      if (!inputData) throw fetchError;
      inputRef.current.value = inputData.address_components[0].long_name;
      inputRef.current.blur();
      inputRef.current.disabled = true;

      inputCoords.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(inputCoords, radiusKM, radiusRings);
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) throw fetchError;
      const finalData = await fetchSuburb(weatherData);
      if (!finalData) throw fetchError;

      const parsedData = parseData(finalData);
      if (!parsedData[0]) throw fetchError;

      setCenterPoint({
        lat: inputCoords.current.lat,
        lng: inputCoords.current.lng,
        suburb: inputData.address_components[0].long_name,
        dates: parsedData[0].dates,
        hours: parsedData[0].hours,
      });
      getStats(parsedData);
      setMapData(parsedData);
      setErrorMessage("");
      setLoading(false);
      setChangeLayout(true);
      setTimeout(() => {
        setRenderMap(true);
        inputRef.current.disabled = false;
      }, 500);
    } catch (error) {
      console.error("Initial fetch failed:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  function editButton() {
    setChangeLayout(false);
    setRenderMap(false);
  }

  function tempRainSwitch(e) {
    e.preventDefault();
    switch (currentType) {
      case "temp":
        setCurrentType("rain");
        break;
      case "rain":
        setCurrentType("temp");
        break;
    }
  }

  return (
    <>
      <div
        style={{
          width: "min(100vw, 500px)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "RGBA(31,53,42,1)",
          justifyContent: changeLayout ? "space-between" : "center",
          transition: "flex-grow 1s ease",
        }}
      >
        <header
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 50,
            boxShadow: changeLayout ? "0px 5px 5px 0px rgba(0,0,0,0.3)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          <h1
            style={{
              height: "fit-content",
              paddingBlock: changeLayout ? 10 : 0,
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Better Weather
          </h1>
          {renderMap ? (
            <button
              style={{
                height: changeLayout ? "100%" : 0,
                flexGrow: 1,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {listMap}
            </button>
          ) : null}
        </header>
        <main
          style={{
            flexGrow: changeLayout ? 1 : 0,
            transition: "flex-grow 1s ease",
          }}
        >
          {renderMap ? (
            <Map
              mapData={mapData}
              renderMap={renderMap}
              centerPoint={centerPoint}
              activeHour={activeHour}
              radiusInput={radiusKM}
              radiusRings={radiusRings}
              currentType={currentType}
            />
          ) : null}
        </main>
        <footer
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            boxShadow: changeLayout ? "0px -3px 3px rgba(0,0,0,0.05)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          {changeLayout ? (
            <NavBar
              centerPoint={centerPoint}
              activeHour={activeHour}
              setActiveHour={setActiveHour}
              AMPM={AMPM}
              setAMPM={setAMPM}
              mapData={mapData}
              currentType={currentType}
            />
          ) : null}
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
                  onClick={editButton}
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
          {changeLayout ? null : !loading ? (
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
          ) : null}
        </footer>
      </div>
    </>
  );
}

export default App;
