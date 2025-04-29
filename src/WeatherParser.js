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

  export function parseData(weatherData) {
    return weatherData.map((dataPoint) => new Location(dataPoint));
  }