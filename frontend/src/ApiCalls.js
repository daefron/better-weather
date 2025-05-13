function buildWeatherUrl(lat, lng, timezone, tempUnit) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,weather_code,wind_speed_10m_max",
    hourly: "temperature_2m,precipitation_probability,wind_speed_10m",
    timezone: timezone,
    temperature_unit: tempUnit === "C" ? "celsius" : "fahrenheit",
  }).toString();
  return url.toString();
}

//fetches weather data in weatherCoords points
export async function fetchWeather(weatherCoords, timezone, tempUnit) {
  const promises = weatherCoords.map((coords) => {
    const url = buildWeatherUrl(
      coords.latitude,
      coords.longitude,
      timezone,
      tempUnit
    );
    return fetch(url, { method: "GET" });
  });

  try {
    const responses = await Promise.all(promises);
    const data = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
    );
    console.log("Weather data fetched successfully.");
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
}
