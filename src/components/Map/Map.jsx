import { useState } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useWeatherState } from "../../hooks/WeatherContext";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function GoogleMap() {
  const {
    mapData,
    centerPoint,
    selectedHour,
    normalizedRadius,
    ringCount,
    viewType,
  } = useWeatherState();
  const [activeMarker, setActiveMarker] = useState();
  //zooms map to show all found weather points
  const boundDist = normalizedRadius * ringCount * 0.7;
  const bounds = {
    east: centerPoint.lng + boundDist,
    north: centerPoint.lat + boundDist,
    south: centerPoint.lat - boundDist,
    west: centerPoint.lng - boundDist,
  };
  return (
    <APIProvider apiKey={googleApiKey}>
      <Map
        mapId="mainMap"
        style={{
          width: "min(100vw, 500px)",
          flexGrow: 1,
        }}
        colorScheme="DARK"
        defaultCenter={{ lat: centerPoint.lat, lng: centerPoint.lng }}
        defaultBounds={bounds}
        onClick={() => setActiveMarker()}
        disableDefaultUI
      >
        <AdvancedMarker
          key="centerPointMarker"
          position={{ lat: centerPoint.lat, lng: centerPoint.lng }}
          zIndex={10}
        >
          <div
            style={{
              width: 13,
              height: 13,
              backgroundColor: "white",
              border: "solid black",
              borderRadius: 13,
            }}
          ></div>
        </AdvancedMarker>
        {mapData.map((data, i) => {
          const style = {
            borderRadius: 4,
            padding: 3,
            fontSize: 13,
            color: "black",
          };
          let content, positiveValue, negativeValue, colorRatio;
          switch (viewType) {
            case "temp":
              if (activeMarker === i) {
                content = `${data.suburb} - ${data.hours[selectedHour].temp}°`;
              } else {
                content = `${data.hours[selectedHour].temp}°`;
              }

              colorRatio =
                data.hours[selectedHour].temp /
                centerPoint.hours[selectedHour].temp;
              if (colorRatio < 1) {
                negativeValue = 255;
                positiveValue = 255 * colorRatio;
              } else {
                positiveValue = 255;
                negativeValue = 255 * (2 - colorRatio) * 0.8;
              }
              break;
            case "rain":
              if (activeMarker === i) {
                content = `${data.suburb} - ${data.hours[selectedHour].rainChance}%`;
              } else {
                content = `${data.hours[selectedHour].rainChance}%`;
              }

              colorRatio =
                data.hours[selectedHour].rainChance /
                centerPoint.hours[selectedHour].rainChance;

              //sets to same color if same value
              if (colorRatio === Infinity || isNaN(colorRatio)) {
                negativeValue = 255;
                positiveValue = 255;
                break;
              }
              if (colorRatio < 1) {
                negativeValue = 255 * colorRatio;
                positiveValue = 255;
              } else {
                positiveValue = 255 * (2 - colorRatio);
                negativeValue = 255;
              }
              break;
          }
          style.backgroundColor = `RGBA(${negativeValue}, ${positiveValue}, 0, 1)`;
          let zIndex = 1;
          if (activeMarker === i) {
            style.textDecoration = "underline";
            zIndex = 20;
          } else {
            style.textDecoration = "";
            zIndex = 1;
          }
          return (
            <AdvancedMarker
              key={i + "markerKey"}
              position={{ lat: data.latitude, lng: data.longitude }}
              zIndex={zIndex}
              onClick={() => setActiveMarker(i)}
            >
              <p style={style}>{content}</p>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
