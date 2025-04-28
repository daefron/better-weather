import "./App.css";
import { useState, useRef } from "react";
function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(1);
  const inputCoords = useRef("");

  const circleSettings = {
    gap: radiusInput, //coordinate distance between circles, 1 == 100km or so
    radius: 5, //amount of circles to calculate
  };

  const toRadians = (deg) => (deg * Math.PI) / 180;

  //creates array of coordinate points in radius for weather fetching
  function createPoints() {
    const pointHolder = [[inputCoords.current.lat, inputCoords.current.lng]];
    for (let radius = 1; radius <= circleSettings.radius; radius++) {
      const pointCount = radius * 4; //amount of points for current circle
      const distance = radius * radiusInput; //hypotenuse distance
      const angleSlice = 360 / pointCount; //angle interval in degrees
      for (let point = 0; point < pointCount; point++) {
        const angle = toRadians(angleSlice * point); //angle in radians

        const x = Math.cos(angle) * distance + inputCoords.current.lat;
        const y = Math.sin(angle) * distance + inputCoords.current.lng;

        pointHolder.push([x, y]);
      }
    }
    return pointHolder;
  }

  function buildWeatherUrl(lat, lng) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      daily:
        "temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,weather_code,wind_speed_10m_max",
      timezone: "auto",
    }).toString();
    return url.toString();
  }

  //fetches weather data in weatherCoords points
  async function fetchWeather(weatherCoords) {
    const promises = weatherCoords.map((coords) => {
      const url = buildWeatherUrl(coords[0], coords[1]);
      return fetch(url, { method: "GET" });
    });

    try {
      const responses = await Promise.all(promises);
      const data = await Promise.all(
        responses.map(async (r) => {
          if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);
          }
          return r.json();
        })
      );
      console.log("Weather data fetched successfully.");
      return data;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  }

  function buildSuburbUrl(lat, lng) {
    const apiKey = "";
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.search = new URLSearchParams({
      latlng: lat + "," + lng,
      result_type: "locality",
      key: apiKey,
    }).toString();
    return url.toString();
  }

  async function fetchSuburb(weatherData) {
    const promises = weatherData.map((data) => {
      const url = buildSuburbUrl(data.latitude, data.longitude);
      return fetch(url, { method: "GET" });
    });

    try {
      const responses = await Promise.all(promises);
      const data = await Promise.all(
        responses.map(async (r) => {
          if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);
          }
          return r.json();
        })
      );
      weatherData.forEach((point, i) => {
        if (data[i].results[0]) {
          point.suburb = data[i].results[0].formatted_address;
        }
      });
      console.log("Suburb data fetched successfully.");
      return weatherData;
    } catch (error) {
      console.error("Failed to fetch suburb data:", error);
    }
  }

  function updateLocationInput(e) {
    setLocationInput(e.target.value);
  }

  function updateRadiusInput(e) {
    setRadiusInput(e.target.value);
  }

  function buildCoordUrl() {
    const apiKey = "";
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.search = new URLSearchParams({
      address: locationInput,
      key: apiKey,
    }).toString();
    return url.toString();
  }

  async function fetchCoords(e) {
    e.preventDefault();
    const url = buildCoordUrl();
    fetch(url, { method: "GET" })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! Status: ${r.status}`);
        }
        return r.json();
      })
      .then((result) => {
        console.log(result.results[0].geometry.location);
        inputCoords.current = result.results[0].geometry.location;
        console.log(inputCoords);
        const weatherCoords = createPoints();
        initialFetch(weatherCoords);
      });
  }

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

  async function initialFetch(weatherCoords) {
    const weatherData = await fetchWeather(weatherCoords);
    if (!weatherData) return;
    const finalData = await fetchSuburb(weatherData);
    if (!finalData) return;
    const parsedData = parseData(finalData);
    console.log(parsedData);
    getStats(parsedData);
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
          onSubmit={fetchCoords}
        >
          <label htmlFor="userLocation">Enter a location: </label>
          <input
            type="text"
            id="userLocation"
            onChange={updateLocationInput}
          ></input>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: 300,
          }}
        >
          <label htmlFor="searchRadius">Search radius: {`${radiusInput * 100} km`}</label>
          <input
            type="range"
            id="searchRadius"
            min="0.1"
            max="2"
            step="0.1"
            value={radiusInput}
            onChange={updateRadiusInput}
          ></input>
        </div>
      </div>
    </>
  );
}

export default App;
