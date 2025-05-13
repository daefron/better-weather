const url =
  "https://api.open-meteo.com/v1/forecast?latitude=-37.8136276&longitude=144.9630576&daily=temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,weather_code,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,wind_speed_10m&timezone=Australia/Melbourne&temperature_unit=celsius";

fetch(url)
  .then((res) => res.json())
  .then((data) => console.log("Success", data))
  .catch((err) => console.error("Failure", err));
