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
        style={{ height: 700, width: 500 }}
        defaultCenter={{ lat: centerPoint.lat, lng: centerPoint.lng }}
        defaultBounds={bounds}
        disableDefaultUI
      >
        <AdvancedMarker
          key="centerPointMarker"
          position={{ lat: centerPoint.lat, lng: centerPoint.lng }}
          zIndex={10}
        >
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: "white",
              border: "solid black",
              borderRadius: 10,
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
          return (
            <AdvancedMarker
              key={i + "markerKey"}
              position={{ lat: data.latitude, lng: data.longitude }}
            >
              <p
                style={{
                  backgroundColor: color,
                  border: "solid 2px RGBA(0,0,0,0.5)",
                  borderRadius: 4,
                  padding: 2,
                }}
              >
                {data.dates[activeDate].tempMax}°
              </p>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
