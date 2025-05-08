const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

function buildTimezoneUrl(coords) {
  const url = new URL("https://maps.googleapis.com/maps/api/timezone/json");
  url.search = new URLSearchParams({
    location: coords.lat + "," + coords.lng,
    timestamp: Date.now() / 1000,
    key: googleApiKey,
  }).toString();
  return url.toString();
}

export async function fetchTimezone(coords) {
  const url = buildTimezoneUrl(coords);
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }

  const result = await response.json();

  console.log("Center-point timezone data fetched successfully.");
  return result.timeZoneId;
}

function buildWeatherUrl(lat, lng, timezone) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,weather_code,wind_speed_10m_max",
    hourly: "temperature_2m,precipitation_probability,wind_speed_10m",
    timezone: timezone,
  }).toString();
  return url.toString();
}

//fetches weather data in weatherCoords points
export async function fetchWeather(weatherCoords, timezone) {
  const promises = weatherCoords.map((coords) => {
    const url = buildWeatherUrl(coords[0], coords[1], timezone);
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

function buildSuburbUrl(lat, lng) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.search = new URLSearchParams({
    latlng: lat + "," + lng,
    result_type: "locality",
    key: googleApiKey,
  }).toString();
  return url.toString();
}

export async function fetchSuburb(weatherData) {
  const promises = weatherData.map((data) => {
    const url = buildSuburbUrl(
      data.latitude.toFixed(5),
      data.longitude.toFixed(5)
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
    weatherData.forEach((point, i) => {
      if (data[i].results[0]) {
        point.suburb = data[i].results[0].address_components[0].long_name;
      }
    });
    console.log("Suburb data fetched successfully.");
    return weatherData;
  } catch (error) {
    console.error("Failed to fetch suburb data:", error);
    throw error;
  }
}

function buildCoordUrl(locationInput) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.search = new URLSearchParams({
    address: locationInput,
    key: googleApiKey,
  }).toString();
  return url.toString();
}

export async function fetchCoords(locationInput) {
  const url = buildCoordUrl(locationInput);
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }

  const result = await response.json();

  if (!result.results.length) {
    throw new Error("No results found for this location.");
  }
  console.log("Center-point geometry data fetched successfully.");
  const coords = result.results[0].geometry.location;
  return result.results[0];
}
