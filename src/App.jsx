import "./App.css";

function App() {
  //testing coordinates
  const melbourneTestCoords = {
    lat: -37.8136,
    long: 144.9631,
  };

  //user inputs
  const input = {
    lat: melbourneTestCoords.lat,
    long: melbourneTestCoords.long,
  };

  const circleSettings = {
    gap: 0.1, //coordinate distance between circles, 1 == 100km or so
    radius: 3, //amount of circles to calculate
  };

  const toRadians = Math.PI / 180;

  //creates array of coordinate points in radius for weather fetching
  function createPoints() {
    const pointHolder = [];
    for (let radius = 1; radius <= circleSettings.radius; radius++) {
      const pointCount = radius * 4; //amount of points for current circle
      const distance = radius * circleSettings.gap; //hypotenuse distance
      const angleSlice = 360 / pointCount; //angle interval in degrees
      for (let point = 0; point < pointCount; point++) {
        const angle = angleSlice * point * toRadians; //angle in radians

        const x = Math.cos(angle) * distance + input.lat;
        const y = Math.sin(angle) * distance + input.long;

        pointHolder.push([x, y]);
      }
    }
    return pointHolder;
  }

  const weatherCoords = createPoints();
  console.log(weatherCoords);

  //fetches weather data in weatherCoords points
  async function fetchWeather(weatherCoords) {
    const promises = weatherCoords.map((coords) => {
      const url = buildWeatherUrl(coords[0], coords[1]);
      return fetch(url, { method: "GET" });
    });

    function buildWeatherUrl(lat, lon) {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,weather_code,wind_speed_10m_max",
        timezone: "auto",
      }).toString();
      return url.toString();
    }

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

  async function fetchSuburb(weatherData) {
    const promises = weatherData.map((data) => {
      const url = buildSuburbUrl(data.latitude, data.longitude);
      return fetch(url, { method: "GET" });
    });

    function buildSuburbUrl(lat, lon) {
      const apiKey = "";
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.search = new URLSearchParams({
        latlng: lat + "," + lon,
        result_type: "locality",
        key: apiKey,
      }).toString();
      return url.toString();
    }

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

  async function initialFetch() {
    const weatherData = await fetchWeather(weatherCoords);
    if (!weatherData) return;
    const finalData = await fetchSuburb(weatherData);
    if (!finalData) return;
    const parsedData  = parseData(finalData);
    console.log(parsedData);
  }

  initialFetch();

  return (
    <>
      <div>hi</div>
    </>
  );
}

export default App;
