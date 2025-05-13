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
  constructor(data, startPoint) {
    this.suburb = data.suburb || "Unknown suburb";
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.distance = getDistance([this.longitude, this.latitude], startPoint);
    this.dates = data.daily.time.map(
      (_, index) => new DailyWeather(data.daily, index)
    );
    this.hours = data.hourly.time.map(
      (_, index) => new HourlyWeather(data.hourly, index)
    );

    //uses the haversine formula to get the distance between two points
    function getDistance(location, startPoint) {
      const toRad = (deg) => (deg * Math.PI) / 180;
      const R = 6371; // Radius of Earth in km

      const lat1 = toRad(startPoint[0]);
      const lng1 = toRad(startPoint[1]);
      const lat2 = toRad(location[0]);
      const lng2 = toRad(location[1]);

      const latDiff = lat2 - lat1;
      const lngDiff = lng2 - lng1;

      const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
  }
}

export function parseData(weatherData) {
  return weatherData.map(
    (dataPoint) =>
      new Location(dataPoint, [
        weatherData[0].longitude,
        weatherData[0].latitude,
      ])
  );
}
