import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function GoogleMap({ mapCoords, mapData, renderMap }) {
  return renderMap ? (
    <APIProvider apiKey={googleApiKey}>
      <Map
        mapId="mainMap"
        defaultZoom={9}
        style={{ height: 500, width: 800 }}
        defaultCenter={mapCoords}
      >
        {mapData.map((data, i) => {
          if (i === 0) {
            return (
              <AdvancedMarker
                key={i + "markerKey"}
                position={{ lat: data.latitude, lng: data.longitude }}
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
            );
          }
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
  ) : null;
}
