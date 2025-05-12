import { createContext, useContext, useState, useRef, useMemo } from "react";
import { coordinateMaker } from "../CoordinateMaker";
import {
  fetchWeather,
  fetchSuburb,
  fetchCoords,
  fetchTimezone,
} from "../ApiCalls";
import { parseData } from "../WeatherParser";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [radiusKMInput, setRadiusKMInput] = useState(50); //coordinate distance between circles in km
  const [radiusDensity, setRadiusDensity] = useState(2); //how often points are chosen on circle
  const [tempUnit, setTempUnit] = useState("C"); //sets celsius/fahrenheit
  const [dateFormat, setDateFormat] = useState("DD/MM"); //sets date format for display
  const [selectedHour, setSelectedHour] = useState(10); //user-selected hour
  const [unitType, setUnitType] = useState("temp"); //toggles between temp/rain
  const [amPm, setAmPm] = useState("AM"); //toggles between AM/PM
  const [selectedLocation, setSelectedLocation] = useState();
  const [useHours, setUseHours] = useState(false);

  const normalizedRadius = useMemo(() => radiusKMInput / 554, [radiusKMInput]); //changes user input into value for math
  const ringCount = Math.round(radiusKMInput / 10); //amount of rings for coordinate search

  const [showMap, setShowMap] = useState(false); //shows/hides the map
  const [showList, setShowList] = useState(false); //shows/hides the list
  const [loading, setLoading] = useState(false); //shows/hides while loading
  const [changeLayout, setChangeLayout] = useState(false); //changes layout
  const [shrinkNav, setShrinkNav] = useState(true); //tells nav to grow/shrink before rerender

  const inputCoordsRef = useRef(""); //parsed coordinates from user input
  const [mapData, setMapData] = useState([]); //parsed data to be shown on map
  const [userPoint, setUserPoint] = useState(); //parsed data of user input
  const [viewArea, setViewArea] = useState();
  const sortedData = useRef(); //data sorted for list

  const inputRef = useRef(); //user input element ref

  const [errorMessage, setErrorMessage] = useState(); //error message to display

  const lastState = useRef();
  const lastSearched = useRef(); //data from last search

  function resetLayout() {
    setShowMap(false);
    setShowList(false);
    setChangeLayout(false);
    setSelectedHour(10);
    setUseHours(false);
    inputRef.current.disabled = false;
  }

  function errorReset() {
    inputRef.current.disabled = false;
    inputRef.current.focus();
    lastSearched.current = null;
    throw new Error("No results found for this location.");
  }

  //used when user clicks on marker in list
  function clickMarker(place) {
    setShowList(!showList);
    setSelectedLocation(place.index);
  }

  function clickListMap(index) {
    setShowList(true);
    const sortedIndex = sortedData.current.findIndex(
      (point) => point.index === index
    );
    const scrollDiv = document.getElementById("suburbList" + sortedIndex);
    scrollDiv.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }

  function getUserLocation(e) {
    setLoading(true);
    inputRef.current.value = "Finding your location...";
    async function success(result) {
      const coords = [result.coords];

      //get name of suburb from coords
      const suburbData = await fetchSuburb(coords);
      if (!suburbData) {
        errorReset;
      }
      const suburb = suburbData[0].suburb;

      inputRef.current.value = suburb;
      inputRef.current.blur();
      inputRef.current.disabled = true;
      inputCoordsRef.current = {
        lat: coords[0].latitude,
        lng: coords[0].longitude,
      };

      userSubmit(e, suburb);
    }
    navigator.geolocation.getCurrentPosition(success, (error) => {
      setLoading(false);
      errorReset();
    });
  }

  //fetches an auto-filled location name, then replaces user input with name
  async function autoCorrectSuburb(input) {
    const inputData = await fetchCoords(input);
    if (!inputData) errorReset();
    inputRef.current.value = inputData.address_components[0].long_name;
    inputRef.current.blur();
    inputRef.current.disabled = true;
    inputCoordsRef.current = inputData.geometry.location;
  }

  function sameState() {
    if (!lastState.current) return;
    if (inputRef.current.value !== lastState.current.inputRef) return;
    if (radiusKMInput !== lastState.current.radiusKMInput) return;
    if (radiusDensity !== lastState.current.radiusDensity) return;
    if (tempUnit !== lastState.current.tempUnit) return;
    if (dateFormat !== lastState.current.dateFormat) return;
    return true;
  }

  async function userSubmit(e, suburbFetched) {
    e.preventDefault();

    //prevents multiple requests
    if (loading) return;
    resetLayout();

    setLoading(true);

    try {
      //skips excess API calls if has same input as last search
      if (!sameState()) {
        if (!suburbFetched) {
          await autoCorrectSuburb(inputRef.current.value);
        }
        lastState.current = {
          inputRef: inputRef.current.value,
          radiusKMInput: radiusKMInput,
          radiusDensity: radiusDensity,
          tempUnit: tempUnit,
          dateFormat: dateFormat,
        };

        const weatherCoords = coordinateMaker(
          inputCoordsRef,
          normalizedRadius,
          ringCount,
          radiusDensity
        );

        const timezone = await fetchTimezone(inputCoordsRef.current);
        if (!timezone) errorReset();

        const weatherData = await fetchWeather(
          weatherCoords,
          timezone,
          tempUnit
        );
        if (!weatherData) errorReset();

        const finalData = await fetchSuburb(weatherData);
        if (!finalData) errorReset();

        const parsedData = parseData(finalData);
        if (!parsedData[0]) errorReset();

        setUserPoint({
          lat: inputCoordsRef.current.lat,
          lng: inputCoordsRef.current.lng,
          suburb: inputRef.current.value,
          dates: parsedData[0].dates,
          hours: parsedData[0].hours,
        });
        setViewArea({
          lat: inputCoordsRef.current.lat,
          lng: inputCoordsRef.current.lng,
        });
        setMapData(parsedData);
      }
      setErrorMessage("");
      setLoading(false);
      setChangeLayout(true);
      setTimeout(() => {
        setShowMap(true);
      }, 1000);
    } catch (error) {
      console.error("Initial fetch failed:", error);
      setErrorMessage(error.message);
      setLoading(false);
      inputRef.current.disabled = false;
    }
  }

  return (
    <WeatherContext.Provider
      value={{
        radiusKMInput,
        setRadiusKMInput,
        ringCount,
        mapData,
        userPoint,
        loading,
        errorMessage,
        selectedHour,
        setSelectedHour,
        unitType,
        setUnitType,
        inputRef,
        userSubmit,
        getUserLocation,
        showMap,
        setShowMap,
        changeLayout,
        setChangeLayout,
        normalizedRadius,
        amPm,
        setAmPm,
        showList,
        setShowList,
        selectedLocation,
        setSelectedLocation,
        useHours,
        setUseHours,
        resetLayout,
        shrinkNav,
        setShrinkNav,
        radiusDensity,
        setRadiusDensity,
        tempUnit,
        setTempUnit,
        dateFormat,
        setDateFormat,
        clickMarker,
        clickListMap,
        sortedData,
        viewArea,
        setViewArea,
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
