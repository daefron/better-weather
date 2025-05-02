class DailyWeather {
  constructor(dailyData, index) {
    this.date = dailyData.time[index];
    this.temp = dailyData.temperature_2m_max[index];
    this.rainChance = dailyData.precipitation_probability_max[index];
    this.windMax = dailyData.wind_speed_10m_max[index];
  }
}
class HourlyWeather {
  constructor(hourlyData, index) {
    this.time = hourlyData.time[index].split("T")[1];
    this.temp = hourlyData.temperature_2m[index];
    this.rainChance = hourlyData.precipitation_probability[index];
    this.windMax = hourlyData.wind_speed_10m[index];
  }
}
class Location {
  constructor(data) {
    this.suburb = data.suburb || "Unknown suburb";
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.dates = data.daily.time.map(
      (_, index) => new DailyWeather(data.daily, index)
    );
    this.hours = data.hourly.time.map(
      (_, index) => new HourlyWeather(data.hourly, index)
    );
  }
}

export function parseData(weatherData) {
  return weatherData
    .map((dataPoint) => new Location(dataPoint));
}
