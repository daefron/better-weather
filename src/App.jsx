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
    const promises = weatherCoords.map((weather) => {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        weather[0] +
        "&longitude=" +
        weather[1] +
        "&hourly=temperature_2m,precipitation,precipitation_probability,cloud_cover,wind_speed_10m&timezone=auto";
      return fetch(url);
    });

    try {
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map((r) => r.json()));
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  }

  fetchWeather(weatherCoords);

  return (
    <>
      <div>hi</div>
    </>
  );
}

export default App;
