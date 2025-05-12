import {
  AdvancedMarker,
  CollisionBehavior,
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useWeatherState } from "../../hooks/WeatherContext";
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

export default function GoogleMap() {
  const {
    mapData,
    userPoint,
    selectedHour,
    normalizedRadius,
    ringCount,
    unitType,
    selectedLocation,
    setSelectedLocation,
    useHours,
    clickListMap,
  } = useWeatherState();
  //zooms map to show all found weather points
  const boundDist = normalizedRadius * ringCount * 0.7;
  const bounds = {
    east: centerPoint.lng + boundDist,
    north: centerPoint.lat + boundDist,
    south: centerPoint.lat - boundDist,
    west: centerPoint.lng - boundDist,
  };

  function TempMarker({ data, i }) {
    const style = {
      display: "flex",
      gap: 5,
      borderRadius: 4,
      padding: 3,
      fontSize: 13,
      color: "black",
      border: "2px solid rgba(0,0,0,0.2)",
    };
    const contentValue = useHours
      ? data.hours[selectedHour][unitType]
      : data.dates[Math.floor(selectedHour / 24)][unitType];

    const colorRatio = useHours
      ? contentValue / centerPoint.hours[selectedHour][unitType]
      : contentValue /
        centerPoint.dates[Math.floor(selectedHour / 24)][unitType];

    let content, positiveValue, negativeValue;
    switch (unitType) {
      case "temp":
        if (selectedLocation === i) {
          content = `${data.suburb} - ${contentValue}°`;
        } else {
          content = `${contentValue}°`;
        }
        if (colorRatio < 1) {
          negativeValue = 255;
          positiveValue = 255 * colorRatio;
        } else {
          positiveValue = 255;
          negativeValue = 255 * (2 - colorRatio) * 0.8;
        }
        break;
      case "rainChance":
        if (selectedLocation === i) {
          content = `${data.suburb} - ${contentValue}%`;
        } else {
          content = `${contentValue}%`;
        }

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
      case "windMax":
        if (selectedLocation === i) {
          content = `${data.suburb} - ${contentValue}km/h`;
        } else {
          content = `${contentValue}km/h`;
        }
        if (colorRatio > 1) {
          negativeValue = 255;
          positiveValue = 255 * colorRatio;
        } else {
          positiveValue = 255;
          negativeValue = 255 * (2 - colorRatio) * 0.8;
        }
        break;
    }
    style.backgroundColor = `RGBA(${negativeValue}, ${positiveValue}, 0, 1)`;
    let zIndex = 1;
    if (selectedLocation === i) {
      style.textDecoration = "underline";
      style.fontSize = 16;
      zIndex = 20;
    } else {
      style.textDecoration = "";
      zIndex = 1;
    }
    return (
      <AdvancedMarker
        style={style}
        position={{ lat: data.latitude, lng: data.longitude }}
        zIndex={zIndex}
        onClick={() => setSelectedLocation(selectedLocation === i ? null : i)}
        collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
      >
        <p style={{ color: "black" }}>{content}</p>
        {selectedLocation === i ? (
          <FontAwesomeIcon
            icon={faList}
            color="black"
            style={{
              height: 18,
              width: 18,
            }}
            onClick={(e) => {
              e.stopPropagation();
              clickListMap(i);
            }}
          />
        ) : null}
      </AdvancedMarker>
    );
  }

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
        onClick={() => setSelectedLocation()}
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
          return <TempMarker data={data} i={i} key={i + "markerKey"} />;
        })}
      </Map>
    </APIProvider>
  );
}
