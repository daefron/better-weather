import "./App.css";
import { useState, useRef } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(0.13); //coordinate distance between circles, 1 == 111km
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [mapCoords, setMapCoords] = useState();

  class Weather {
    constructor(dailyData, index) {
      this.date = dailyData.time[index];
      this.tempMax = dailyData.temperature_2m_max[index];
      this.tempMin = dailyData.temperature_2m_min[index];
      this.rainChance = dailyData.precipitation_probability_max[index];
      this.rainHours = dailyData.precipitation_hours[index];
      this.windMax = dailyData.wind_speed_10m_max[index];
    }
  }

  class Location {
    constructor(data) {
      this.suburb = data.suburb || "Unknown suburb";
      this.longitude = data.longitude;
      this.latitude = data.latitude;
      this.dates = data.daily.time.map(
        (_, index) => new Weather(data.daily, index)
      );
    }
  }

  function parseData(weatherData) {
    return weatherData.map((dataPoint) => new Location(dataPoint));
  }

  function getHighest(type, data, date) {
    let highest = {
      name: data[0].suburb,
      [type]: data[0].dates[date][type],
      index: 0,
    };
    data.forEach((location, index) => {
      if (location.dates[date][type] > highest[type]) {
        highest = {
          name: location.suburb,
          [type]: location.dates[date][type],
          index: index,
        };
      }
    });
    return [data[highest.index], highest[type]];
  }

  function getLowest(type, data, date) {
    let lowest = {
      name: data[0].suburb,
      [type]: data[0].dates[date][type],
      index: 0,
    };
    data.forEach((location, index) => {
      if (location.dates[date][type] < lowest[type]) {
        lowest = {
          name: location.suburb,
          [type]: location.dates[date][type],
          index: index,
        };
      }
    });
    return [data[lowest.index], lowest[type]];
  }

  function getStats(data) {
    for (let i = 0; i < 7; i++) {
      const date = data[0].dates[i].date;
      const userLocation = data[0].dates[i];
      const hottestTemp = getHighest("tempMax", data, i);
      const lowestTemp = getLowest("tempMax", data, i);
      const lowestRain = getLowest("rainChance", data, i);
      const lowestWind = getLowest("windMax", data, i);

      console.log(`${date} DATA:`);
      console.log(
        `Hottest temp: ${hottestTemp[0].suburb} ${hottestTemp[1]}C vs ${userLocation.tempMax}C`
      );
      console.log(
        `Coldest temp: ${lowestTemp[0].suburb} ${lowestTemp[1]}C vs ${userLocation.tempMax}C`
      );
      console.log(
        `Least rain: ${lowestRain[0].suburb} ${lowestRain[1]}% vs ${userLocation.rainChance}%`
      );
      console.log(
        `Lowest wind: ${lowestWind[0].suburb} ${lowestWind[1]}km/h vs ${userLocation.windMax}km/h`
      );
    }
  }

  async function initialFetch(e) {
    e.preventDefault();

    inputCoords.current = await fetchCoords(locationInput);
    console.log(inputCoords.current);
    if (!inputCoords.current) return;
    const weatherCoords = coordinateMaker(inputCoords, radiusInput);
    console.log(weatherCoords);
    const weatherData = await fetchWeather(weatherCoords);
    if (!weatherData) return;

    const finalData = await fetchSuburb(weatherData);
    if (!finalData) return;

    const parsedData = parseData(finalData);
    console.log(parsedData);
    getStats(parsedData);
    setMapData(parsedData);
    setMapCoords(inputCoords.current);
    console.log(parsedData);
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
                  position={{ lat: data.latitude, lng: data.longitude }}
                >
                  <p key={i + "markerKey"}>{data.dates[0].tempMax}</p>
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
