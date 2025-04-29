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
  const [radiusInput, setRadiusInput] = useState(0.13); //coordinate distance between circles, 1 == 111km
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [renderMap, setRenderMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centerPoint, setCenterPoint] = useState();
  const [activeDate, setActiveDate] = useState(0);

  async function initialFetch(e) {
    e.preventDefault();
    setLoading(true);
    setRenderMap(false);

    try {
      const inputData = await fetchCoords(locationInput);
      if (!inputData) return;
      inputCoords.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(inputCoords, radiusInput);
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) return;

      const finalData = await fetchSuburb(weatherData);
      if (!finalData) return;

      const parsedData = parseData(finalData);

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

  return (
    <>
      <div
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "RGBA(130,145,255,0.5)",
        }}
      >
        <header style={{ margin: 10 }}>
          <h2>Better Weather</h2>
        </header>
        {renderMap ? (
          <main style={{ display: "flex", flexDirection: "column" }}>
            <Map
              mapData={mapData}
              renderMap={renderMap}
              centerPoint={centerPoint}
              activeDate={activeDate}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
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
              }}
            >
              <p style={{ flexGrow: 0 }}>
                {centerPoint.suburb} -{" "}
                {`${Math.round((radiusInput * 1111) / 2)} km`}
              </p>
              <button onClick={editButton}>Edit</button>
            </div>
          </main>
        ) : (
          <main>
            {loading ? <div>loading</div> : null}
            <form
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 300,
              }}
              onSubmit={initialFetch}
            >
              <label htmlFor="userLocation">Enter a location: </label>
              <input
                type="text"
                id="userLocation"
                onChange={(e) => setLocationInput(e.target.value)}
                defaultValue={locationInput}
              ></input>
            </form>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 300,
              }}
            >
              <label htmlFor="searchRadius">
                Search radius: {`${Math.round((radiusInput * 1111) / 2)} km`}
              </label>
              <input
                type="range"
                id="searchRadius"
                min="0.05"
                max="0.3"
                step="0.01"
                value={radiusInput}
                onChange={(e) => setRadiusInput(e.target.value)}
              ></input>
            </div>
          </main>
        )}
      </div>
    </>
  );
}

export default App;
