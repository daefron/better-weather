import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function GoogleMap({ mapData, centerPoint }) {
  return (
    <APIProvider apiKey={googleApiKey}>
      <Map
        mapId="mainMap"
        defaultZoom={9}
        style={{ height: 700, width: 500 }}
        defaultCenter={{ lat: centerPoint.lat, lng: centerPoint.lng }}
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
          return (
            <AdvancedMarker
              key={i + "markerKey"}
              position={{ lat: data.latitude, lng: data.longitude }}
            >
              <p
                style={{
                  backgroundColor: "RGBA(255,255,255,0.8)",
                  border: "solid 2px RGBA(0,0,0,0.5)",
                  borderRadius: 4,
                  padding: 2,
                }}
              >
                {data.dates[0].tempMax}°
              </p>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
