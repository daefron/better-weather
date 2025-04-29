import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function googleMap({mapCoords, mapData}) {
  return (
    <APIProvider apiKey={googleApiKey}>
      <Map
        defaultCenter={{ lat: 0, lng: 0 }}
        center={mapCoords}
        defaultZoom={9}
        mapId="mainMap"
        style={{ height: 500, width: 800 }}
      >
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
