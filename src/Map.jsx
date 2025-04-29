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
        style={{ height: 500, width: 800 }}
        defaultCenter={{ lat: centerPoint.lat, lng: centerPoint.lng }}
      >
        <AdvancedMarker
          key="centerPointMarker"
          position={{ lat: centerPoint.lat, lng: centerPoint.lng }}
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
              <p>{data.dates[0].tempMax}</p>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
