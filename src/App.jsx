import "./App.css";

import { useWeatherState } from "./hooks/WeatherContext";

import Map from "./components/Map/Map";
import NavBar from "./components/NavBar/NavBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Settings from "./components/Settings/Settings";
import List from "./components/List/List";

function App() {
  const { loading, showMap, changeLayout } = useWeatherState();
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div
        style={{
          height: "100%",
          flexGrow: 1,
          backgroundColor: "black",
          zIndex: 100,
        }}
      />
      <div
        style={{
          width: "min(100vw, 500px)",
          height: "100%",
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
            border: changeLayout ? "1px outset black" : null,
            boxSizing: "border-box",
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
          }}
        >
          <h1
            style={{
              height: "fit-content",
              paddingBlock: changeLayout ? 10 : 0,
              fontSize: changeLayout ? "clamp(20px, 7vw, 34px)" : null,
              textAlign: "center",
              flexGrow: 1,
              fontWeight: "normal",
            }}
          >
            Better Weather
          </h1>
        </header>
        <main
          style={{
            flexGrow: changeLayout ? 1 : 0,
            transition: "flex-grow 1s ease",
            width: "100%",
            display: "flex",
            height: "0%",
            maxHeight: "90%",
            backgroundColor: "rgba(15,26,21,1)",
            transition: "all 1s ease",
          }}
        >
          {showMap ? (
            <>
              <Map />
              <List />
            </>
          ) : null}
        </main>
        <footer
          style={{
            width: "100%",
            height: changeLayout ? "auto" : 200,
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            zIndex: 50,
            boxShadow: changeLayout ? "0px -3px 3px rgba(0,0,0,0.05)" : null,
            transition: "flex-grow 1s ease",
            flexGrow: changeLayout ? 0 : 1,
            flexShrink: changeLayout ? 1 : 0,
            paddingBottom: changeLayout ? 5 : 0,
          }}
        >
          <NavBar />
          <SearchBar />
          <Settings />
          {!changeLayout ? (
            <p
              style={{
                alignSelf: "center",
                marginTop: "auto",
                marginBottom: 40,
              }}
            >
              Created by Thomas Evans
            </p>
          ) : null}
        </footer>
      </div>
      <div
        style={{
          height: "100%",
          flexGrow: 1,
          backgroundColor: "black",
          zIndex: 100,
        }}
      />
    </div>
  );
}

export default App;
