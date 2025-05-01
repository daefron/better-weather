import "./App.css";
import { useState, useRef, useMemo } from "react";

import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";
import Map from "./Components/Map";
import NavBar from "./Components/NavBar/NavBar";
import SearchBar from "./Components/SearchBar/SearchBar";
import Settings from "./Components/Settings/Settings";

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
          <SearchBar
            changeLayout={changeLayout}
            userSubmit={userSubmit}
            setLocationInput={setLocationInput}
            editButton={editButton}
            errorMessage={errorMessage}
            loading={loading}
            inputRef={inputRef}
            currentType={currentType}
            setCurrentType={setCurrentType}
          />
          {changeLayout ? null : !loading ? (
            <Settings
              radiusInput={radiusInput}
              setRadiusInput={setRadiusInput}
            />
          ) : null}
        </footer>
      </div>
    </>
  );
}

export default App;
