import { createContext, useContext, useState, useRef, useMemo } from "react";
import { coordinateMaker } from "../CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "../ApiCalls";
import { parseData } from "../WeatherParser";
import { getStats } from "../DataProcessing";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [locationInput, setLocationInput] = useState(""); //user-typed location
  const [radiusKMInput, setRadiusKMInput] = useState(50); //coordinate distance between circles in km
  const [selectedHour, setSelectedHour] = useState(8); //user-selected hour
  const [viewType, setViewType] = useState("temp"); //toggles between temp/rain
  const [amPm, setAmPm] = useState("AM"); //toggles between AM/PM

  const normalizedRadius = useMemo(() => radiusKMInput / 554, [radiusKMInput]); //changes user input into value for math
  const ringCount = Math.round(radiusKMInput / 10); //amount of rings for coordinate search

  const [showMap, setShowMap] = useState(false); //shows/hides the map
  const [showList, setShowList] = useState(false); //shows/hides the list
  const [loading, setLoading] = useState(false); //shows/hides while loading
  const [changeLayout, setChangeLayout] = useState(false); //changes layout

  const inputCoordsRef = useRef(""); //parsed coordinates from locationInput
  const [mapData, setMapData] = useState([]); //parsed data to be shown on map
  const [centerPoint, setCenterPoint] = useState(); //parsed data from locationInput

  const inputRef = useRef(); //locationInput element ref

  const [errorMessage, setErrorMessage] = useState(); //error message to display

  async function userSubmit(e) {
    e.preventDefault();

    //prevents multiple requests
    if (loading) return;

    setLoading(true);
    setShowMap(false);
    setShowList(false);

    try {
      const fetchError = new Error("No results found for this location.");
      const inputData = await fetchCoords(locationInput);
      if (!inputData) throw fetchError;
      inputRef.current.value = inputData.address_components[0].long_name;
      inputRef.current.blur();
      inputRef.current.disabled = true;

      inputCoordsRef.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(
        inputCoordsRef,
        normalizedRadius,
        ringCount
      );
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) throw fetchError;

      const finalData = await fetchSuburb(weatherData);
      if (!finalData) throw fetchError;

      const parsedData = parseData(finalData);
      if (!parsedData[0]) throw fetchError;

      setCenterPoint({
        lat: inputCoordsRef.current.lat,
        lng: inputCoordsRef.current.lng,
        suburb: inputData.address_components[0].long_name,
        dates: parsedData[0].dates,
        hours: parsedData[0].hours,
      });
      getStats(parsedData);
      setMapData(parsedData);
      setErrorMessage("");
      setLoading(false);
      setChangeLayout(true);
      setTimeout(() => {
        setShowMap(true);
        inputRef.current.disabled = false;
      }, 1000);
    } catch (error) {
      console.error("Initial fetch failed:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <WeatherContext.Provider
      value={{
        setLocationInput,
        radiusKMInput,
        setRadiusKMInput,
        ringCount,
        mapData,
        centerPoint,
        loading,
        errorMessage,
        selectedHour,
        setSelectedHour,
        viewType,
        setViewType,
        inputRef,
        userSubmit,
        showMap,
        setShowMap,
        changeLayout,
        setChangeLayout,
        normalizedRadius,
        amPm,
        setAmPm,
        showList,
        setShowList,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
export function useWeatherState() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherState must be used within a WeatherProvider");
  }
  return context;
}
