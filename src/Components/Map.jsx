import { useState } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function GoogleMap({
  mapData,
  centerPoint,
  activeDate,
  radiusInput,
  radiusRings,
}) {
  const [activeMarker, setActiveMarker] = useState();

  //zooms map to show all found weather points
  const boundDist = radiusInput * radiusRings * 0.7;
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
        style={{ height: "min(50vh, 700px)", width: "min(100vw, 500px)" }}
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
          let positiveValue;
          let negativeValue;
          const colorRatio =
            data.dates[activeDate].tempMax /
            centerPoint.dates[activeDate].tempMax;
          if (colorRatio < 1) {
            negativeValue = 255;
            positiveValue = 255 * colorRatio;
          } else {
            positiveValue = 255;
            negativeValue = 255 * (2 - colorRatio) * 0.8;
          }
          const color = `RGBA(${negativeValue}, ${positiveValue}, 0, 1)`;
          const style = {
            backgroundColor: color,
            borderRadius: 4,
            padding: 3,
            fontSize: 13
          };
          let content;
          let zIndex = 1;
          if (activeMarker === i) {
            content = `${data.suburb} - ${data.dates[activeDate].tempMax}°`;
            style.textDecoration = "underline"
            zIndex = 20;
          } else {
            content = `${data.dates[activeDate].tempMax}°`;
            style.textDecoration = ""
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
