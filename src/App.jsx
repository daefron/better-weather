import "./App.css";
import { useState, useRef } from "react";
import { BarLoader } from "react-spinners";
import { coordinateMaker } from "./CoordinateMaker";
import { fetchWeather, fetchSuburb, fetchCoords } from "./ApiCalls";
import { parseData } from "./WeatherParser";
import { getStats } from "./DataProcessing";
import Map from "./Components/Map";
import WeatherDate from "./Components/WeatherDate";

function App() {
  //user inputs
  const [locationInput, setLocationInput] = useState("");
  const [radiusInput, setRadiusInput] = useState(50); //coordinate distance between circles in km
  const radiusRings = Math.round(radiusInput / 10);
  const inputCoords = useRef("");
  const [mapData, setMapData] = useState([]);
  const [changeLayout, setChangeLayout] = useState(false);
  const [renderMap, setRenderMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centerPoint, setCenterPoint] = useState();
  const [activeHour, setActiveHour] = useState(62);
  const [currentType, setCurrentType] = useState("temp");
  const inputRef = useRef();

  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push((i % 12) + 1);
  }

  async function initialFetch(e) {
    e.preventDefault();
    setLoading(true);
    setRenderMap(false);

    try {
      const inputData = await fetchCoords(locationInput);
      if (!inputData) return;
      inputRef.current.value = inputData.address_components[0].long_name;
      inputRef.current.blur();
      inputCoords.current = inputData.geometry.location;

      const weatherCoords = coordinateMaker(
        inputCoords,
        radiusInput / 554,
        radiusRings
      );
      const weatherData = await fetchWeather(weatherCoords);
      if (!weatherData) return;
      const finalData = await fetchSuburb(weatherData);
      if (!finalData) return;

      const parsedData = parseData(finalData);
      setCenterPoint({
        lat: inputCoords.current.lat,
        lng: inputCoords.current.lng,
        suburb: inputData.address_components[0].long_name,
        dates: parsedData[0].dates,
        hours: parsedData[0].hours,
      });
      getStats(parsedData);
      setMapData(parsedData);
      setLoading(false);
      setChangeLayout(true);
      setTimeout(() => {
        setRenderMap(true);
      }, 500);
    } catch (error) {
      console.error("Initial fetch failed:", error);
    }
  }

  function editButton() {
    setChangeLayout(false);
    setRenderMap(false);
  }

  function tempRainSwitch() {
    switch (currentType) {
      case "temp":
        setCurrentType("rain");
        break;
      case "rain":
        setCurrentType("temp");
        break;
    }
  }

  return (
    <>
      <div
        style={{
          width: "min(100vw, 500px)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "RGBA(130,145,255,0.5)",
          justifyContent: changeLayout ? "space-between" : "center",
          transition: "flex-grow 1s ease",
        }}
      >
        <header
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            paddingBlock: changeLayout ? 10 : 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 50,
            boxShadow: changeLayout ? "0px 5px 5px 0px rgba(0,0,0,0.3)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          <h1 style={{ height: "fit-content" }}>Better Weather</h1>
        </header>
        <main
          style={{
            backgroundColor: "rgba(132,215,235,1)",
            flexGrow: changeLayout ? 1 : 0,
            transition: "flex-grow 1s ease",
          }}
        >
          {renderMap ? (
            <Map
              mapData={mapData}
              renderMap={renderMap}
              centerPoint={centerPoint}
              activeHour={activeHour}
              radiusInput={radiusInput / 554}
              radiusRings={radiusRings}
              currentType={currentType}
            />
          ) : null}
        </main>
        <footer
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            boxShadow: changeLayout ? "0px -3px 3px rgba(0,0,0,0.05)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          {changeLayout ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid RGBA(0,0,0,0.1)",
                }}
              >
                {hours.map((hour, i) => {
                  const style = {
                    flexGrow: 1,
                    height: 18,
                    fontSize: 13,
                    textAlign: "center",
                    borderRight: "1px solid RGBA(0,0,0,0.1)",
                    userSelect: "none",
                  };
                  if (i === 23) {
                    style.borderRight = "none";
                  }
                  if (i === Math.ceil(activeHour % 24)) {
                    style.backgroundColor = "RGBA(255,255,255,0.2)";
                  }
                  return (
                    <div
                      key={i + "hour"}
                      style={style}
                      onClick={() => {
                        const diff = (activeHour % 24) - i;
                        const final = activeHour - diff;
                        setActiveHour(final);
                      }}
                    >
                      <p style={{ height: "100%" }}>{hour}</p>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid RGBA(0,0,0,0.1)",
                }}
              >
                {mapData[0].dates.map((date, i) => {
                  return (
                    <WeatherDate
                      key={"weatherDate" + i}
                      date={date}
                      index={i + 1}
                      activeHour={activeHour}
                      setActiveHour={setActiveHour}
                      currentType={currentType}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
          <form
            onSubmit={initialFetch}
            style={{
              display: "flex",
              flexDirection: changeLayout ? "row" : "column",
              marginInline: changeLayout ? 0 : 15,
              marginBlock: changeLayout ? 0 : 10,
            }}
          >
            <input
              type="text"
              id="userLocation"
              style={{ flexGrow: 1, fontSize: 18, padding: 4 }}
              onChange={(e) => {
                setLocationInput(e.target.value);
              }}
              ref={inputRef}
              placeholder="Search for a location"
            ></input>
            {changeLayout ? (
              <>
                <button onClick={tempRainSwitch}>Switch</button>
                <button onClick={editButton}>Edit</button>
              </>
            ) : loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <BarLoader width="80%" height={5} />
              </div>
            ) : null}
          </form>
          {changeLayout ? null : !loading ? (
            <div
              id="inputs"
              style={{
                width: "auto",
                marginBlock: 10,
                marginInline: 15,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <label htmlFor="searchRadius">
                  Search radius: {`${radiusInput}km`}
                </label>
                <input
                  type="range"
                  id="searchRadius"
                  style={{ flexGrow: 1 }}
                  min="25"
                  max="200"
                  step="1"
                  value={radiusInput}
                  onChange={(e) => setRadiusInput(e.target.value)}
                ></input>
              </div>
            </div>
          ) : null}
        </footer>
      </div>
    </>
  );
}

export default App;
