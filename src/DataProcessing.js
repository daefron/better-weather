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

  export function getStats(data) {
    for (let i = 0; i < 7; i++) {
      const date = data[0].dates[i].date;
      const userLocation = data[0].dates[i];
      const hottestTemp = getHighest("tempMax", data, i);
      const lowestTemp = getLowest("tempMax", data, i);
      const lowestRain = getLowest("rainChance", data, i);
      const lowestWind = getLowest("windMax", data, i);

      // console.log(`${date} DATA:`);
      // console.log(
      //   `Hottest temp: ${hottestTemp[0].suburb} ${hottestTemp[1]}C vs ${userLocation.tempMax}C`
      // );
      // console.log(
      //   `Coldest temp: ${lowestTemp[0].suburb} ${lowestTemp[1]}C vs ${userLocation.tempMax}C`
      // );
      // console.log(
      //   `Least rain: ${lowestRain[0].suburb} ${lowestRain[1]}% vs ${userLocation.rainChance}%`
      // );
      // console.log(
      //   `Lowest wind: ${lowestWind[0].suburb} ${lowestWind[1]}km/h vs ${userLocation.windMax}km/h`
      // );
    }
  }