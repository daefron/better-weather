import "./App.css";
import { useState, useRef } from "react";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";
import Map from "./Components/Map";
import WeatherDate from "./Components/WeatherDate";

function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(50); //coordinate distance between circles in km
  const radiusRings = Math.round(radiusInput / 10);
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [renderMap, setRenderMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centerPoint, setCenterPoint] = useState();
  const [activeDate, setActiveDate] = useState(0);
  const [activeHour, setActiveHour] = useState(12);
  const [currentType, setCurrentType] = useState("temp");
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i % 12);
  }

  async function initialFetch(e) {
    e.preventDefault();
    setLoading(true);
    setRenderMap(false);

    try {
      const inputData = await fetchCoords(locationInput);
      if (!inputData) return;
      inputCoords.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(
        inputCoords,
        radiusInput / 554,
        radiusRings
      );
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) return;

      const finalData = await fetchSuburb(weatherData);
      if (!finalData) return;

      const parsedData = parseData(finalData);
      console.log(parsedData);
      setCenterPoint({
        lat: inputCoords.current.lat,
        lng: inputCoords.current.lng,
        suburb: inputData.address_components[0].long_name,
        dates: parsedData[0].dates,
      });
      getStats(parsedData);
      setMapData(parsedData);
      setLoading(false);
      setRenderMap(true);
    } catch (error) {
      console.error("Initial fetch failed:", error);
    }
  }

  function editButton() {
    setRenderMap(false);
  }

  function tempRainSwitch() {
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
          backgroundColor: "RGBA(130,145,255,0.5)",
          justifyContent: "center",
          transition: "all 1s ease",
        }}
      >
        <header
          style={{
            width: "100%",
            height: renderMap ? "auto" : 200,
            paddingBlock: renderMap ? 10 : 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 50,
            boxShadow: renderMap ? "0px 5px 5px 0px rgba(0,0,0,0.3)" : null,
            transition: "all 1s ease",
            flexGrow: renderMap ? 0 : 1,
          }}
        >
          <h1 style={{ height: "fit-content" }}>Better Weather</h1>
        </header>
        <main
          style={{
            backgroundColor: "rgba(132,215,235,1)",
            flexGrow: renderMap ? 1 : 0,
            transition: "all 1s ease",
          }}
        >
          {renderMap ? (
            <Map
              mapData={mapData}
              renderMap={renderMap}
              centerPoint={centerPoint}
              activeDate={activeDate}
              radiusInput={radiusInput / 554}
              radiusRings={radiusRings}
              currentType={currentType}
            />
          ) : null}
        </main>
        <footer
          style={{
            width: "100%",
            height: renderMap ? "auto" : 200,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            boxShadow: renderMap ? "0px -3px 3px rgba(0,0,0,0.1)" : null,
            transition: "all 1s ease",
            flexGrow: renderMap ? 0 : 1,
          }}
        >
          {renderMap ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid RGBA(0,0,0,0.1)",
                }}
              >
                {hours.map((hour, i) => {
                  const style = {
                    // padding: 4,
                    flexGrow: 1,
                    height: 18,
                    fontSize: 13,
                    textAlign: "center",
                    borderRight: "1px solid RGBA(0,0,0,0.1)",
                    userSelect: "none",
                  };
                  if (i === 23) {
                    style.borderRight = "none";
                  }
                  if (i === activeHour) {
                    style.backgroundColor = "RGBA(255,255,255,0.2)";
                  }
                  return (
                    <div
                      key={i + "hour"}
                      style={style}
                      onClick={() => setActiveHour(i)}
                    >
                      <p style={{ height: "100%" }}>{hour + 1}</p>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid RGBA(0,0,0,0.1)",
                }}
              >
                {mapData[0].dates.map((date, i) => {
                  return (
                    <WeatherDate
                      key={"weatherDate" + i}
                      date={date}
                      index={i}
                      activeDate={activeDate}
                      setActiveDate={setActiveDate}
                      currentType={currentType}
                    />
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: 10,
                  borderBottom: "2px solid RGBA(0,0,0,0.1)",
                }}
              >
                <p style={{ flexGrow: 0 }}>
                  {centerPoint.suburb} - {`${radiusInput} km`}
                </p>
                <button onClick={tempRainSwitch}>Switch</button>
                <button onClick={editButton}>Edit</button>
              </div>
            </>
          ) : (
            <>
              <div
                id="inputs"
                style={{
                  width: "auto",
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <div
                    style={{ width: "auto", padding: 0, textAlign: "center" }}
                  >
                    <h2>Loading</h2>
                  </div>
                ) : (
                  <>
                    <form
                      onSubmit={initialFetch}
                      style={{ display: "flex", marginBottom: 15 }}
                    >
                      <input
                        type="text"
                        id="userLocation"
                        style={{ flexGrow: 1, fontSize: 18, padding: 4 }}
                        onChange={(e) => setLocationInput(e.target.value)}
                        defaultValue={locationInput}
                        placeholder="Search for a location"
                      ></input>
                    </form>
                    <div
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
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </footer>
      </div>
    </>
  );
}

export default App;
