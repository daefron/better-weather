import "./App.css";

import { useWeatherState } from "./hooks/WeatherContext";

import Map from "./components/Map";
import NavBar from "./components/NavBar/NavBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Settings from "./components/Settings/Settings";

function App() {
  const { loading, showMap, changeLayout, listMap } = useWeatherState();
  return (
    <>
      <div
        style={{
          width: "min(100vw, 500px)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "RGBA(31,53,42,1)",
          justifyContent: changeLayout ? "space-between" : "center",
          transition: "flex-grow 1s ease",
        }}
      >
        <header
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 50,
            boxShadow: changeLayout ? "0px 5px 5px 0px rgba(0,0,0,0.3)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          <h1
            style={{
              height: "fit-content",
              paddingBlock: changeLayout ? 10 : 0,
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Better Weather
          </h1>
          {showMap ? (
            <button
              style={{
                height: changeLayout ? "100%" : 0,
                flexGrow: 1,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {listMap}
            </button>
          ) : null}
        </header>
        <main
          style={{
            flexGrow: changeLayout ? 1 : 0,
            transition: "flex-grow 1s ease",
          }}
        >
          {showMap ? <Map /> : null}
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
          {changeLayout ? <NavBar /> : null}
          <SearchBar />
          {changeLayout ? null : !loading ? <Settings /> : null}
        </footer>
      </div>
    </>
  );
}

export default App;
