import "./App.css";
import { useState, useRef } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(0.13); //coordinate distance between circles, 1 == 111km
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [mapCoords, setMapCoords] = useState();

  async function initialFetch(e) {
    e.preventDefault();

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
    } catch (error) {
      console.error("Initial fetch failed:", error);
    }
  }

  return (
    <>
      <div>
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
        <APIProvider apiKey={googleApiKey}>
          <Map
            defaultCenter={{ lat: 0, lng: 0 }}
            center={mapCoords}
            defaultZoom={9}
            mapId="mainMap"
            style={{ height: 500, width: 800 }}
          >
            {mapData.map((data, i) => {
              return (
                <AdvancedMarker
                  key={i + "markerKey"}
                  position={{ lat: data.latitude, lng: data.longitude }}
                >
                  <p>{data.dates[0].tempMax}</p>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>
        <div>
          <p>Date: </p>
        </div>
      </div>
    </>
  );
}

export default App;
