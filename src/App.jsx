import "./App.css";
import { useState, useRef } from "react";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";
import Map from "./Map";

function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(0.13); //coordinate distance between circles, 1 == 111km
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [mapCoords, setMapCoords] = useState();
  const [renderMap, setRenderMap] = useState(false);
  const [loading, setLoading] = useState(false);

  async function initialFetch(e) {
    e.preventDefault();
    setLoading(true);

    try {
      inputCoords.current = await fetchCoords(locationInput);
      if (!inputCoords.current) return;

      const weatherCoords = coordinateMaker(inputCoords, radiusInput);
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) return;

      const finalData = await fetchSuburb(weatherData);
      if (!finalData) return;

      const parsedData = parseData(finalData);
      getStats(parsedData);
      setMapData(parsedData);
      setMapCoords(inputCoords.current);
      setLoading(false);
      setRenderMap(true);
    } catch (error) {
      console.error("Initial fetch failed:", error);
    }
  }

  return (
    <>
      <div>
        <header>
          <h2>Better Weather</h2>
        </header>
        <main>
          {loading ? <div>loading</div> : null}
          <Map mapCoords={mapCoords} mapData={mapData} renderMap={renderMap}/>
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
      </div>
    </>
  );
}

export default App;
