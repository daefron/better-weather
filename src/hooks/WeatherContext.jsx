import { createContext, useContext, useState, useRef, useMemo } from "react";
import { coordinateMaker } from "../CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "../ApiCalls";
import { parseData } from "../WeatherParser";
import { getStats } from "../DataProcessing";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(50); //coordinate distance between circles in km
  const inputCoords = useRef(""); //parsed coordinates from locationInput
  const [renderMap, setRenderMap] = useState(false); //shows/hides the map

  const radiusRings = Math.round(radiusInput / 10);

  const [mapData, setMapData] = useState([]);

  const [loading, setLoading] = useState(false); //shows/hides while loading
  const [centerPoint, setCenterPoint] = useState(); //parsed data from locationInput
  const [activeHour, setActiveHour] = useState(8); //user-selected hour
  const [currentType, setCurrentType] = useState("temp"); //temp/rain
  const inputRef = useRef(); //locationInput element ref
  const radiusKM = useMemo(() => radiusInput / 554, [radiusInput]); //changes user input into value for math
  const [errorMessage, setErrorMessage] = useState();
  const [changeLayout, setChangeLayout] = useState(false); //true shows after loading

  const [AMPM, setAMPM] = useState("AM");
  const [listMap, setListMap] = useState("Map");

  async function userSubmit(e) {
    e.preventDefault();

    //prevents multiple requests
    if (loading) return;

    setLoading(true);
    setRenderMap(false);

    try {
      const fetchError = new Error("No results found for this location.");
      const inputData = await fetchCoords(locationInput);
      if (!inputData) throw fetchError;
      inputRef.current.value = inputData.address_components[0].long_name;
      inputRef.current.blur();
      inputRef.current.disabled = true;

      inputCoords.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(inputCoords, radiusKM, radiusRings);
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) throw fetchError;
      const finalData = await fetchSuburb(weatherData);
      if (!finalData) throw fetchError;

      const parsedData = parseData(finalData);
      if (!parsedData[0]) throw fetchError;

      setCenterPoint({
        lat: inputCoords.current.lat,
        lng: inputCoords.current.lng,
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
        setRenderMap(true);
        inputRef.current.disabled = false;
      }, 500);
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
        radiusInput,
        setRadiusInput,
        radiusRings,
        mapData,
        centerPoint,
        loading,
        errorMessage,
        activeHour,
        setActiveHour,
        currentType,
        setCurrentType,
        inputRef,
        userSubmit,
        renderMap,
        setRenderMap,
        changeLayout,
        setChangeLayout,
        radiusKM,
        AMPM,
        setAMPM,
        listMap,
        setListMap,
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
