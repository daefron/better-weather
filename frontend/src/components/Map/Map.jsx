import {
  AdvancedMarker,
  CollisionBehavior,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import { useWeatherState } from "../../hooks/WeatherContext";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!googleApiKey) {
  throw new Error("Google Maps Api key is missing.");
}

function TempMarker({ data, i }) {
  const {
    selectedHour,
    unitType,
    selectedLocation,
    setSelectedLocation,
    useHours,
    clickListMap,
    setViewArea,
    userPoint,
    setShowList,
  } = useWeatherState();

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
    ? contentValue / userPoint.hours[selectedHour][unitType]
    : contentValue / userPoint.dates[Math.floor(selectedHour / 24)][unitType];

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
    style.fontSize = 16;
    zIndex = 20;
  } else {
    zIndex = 1;
  }
  return (
    <AdvancedMarker
      style={style}
      position={{ lat: data.latitude, lng: data.longitude }}
      zIndex={zIndex}
      onClick={() => {
        setShowList(false);
        setViewArea({ lat: data.latitude, lng: data.longitude });
        setSelectedLocation(i);
        if (selectedLocation === i) {
          clickListMap(i);
        }
      }}
      collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
    >
      <p style={{ color: "black" }}>{content}</p>
    </AdvancedMarker>
  );
}

function GoogleMap() {
  const {
    userPoint,
    normalizedRadius,
    ringCount,
    viewArea,
    setViewArea,
    setSelectedLocation,
    mapData,
    setShowList,
  } = useWeatherState();

  const map = useMap();

  const boundDist = normalizedRadius * ringCount;

  //moves the map bounds to user selected location from list
  useEffect(() => {
    if (map && viewArea) {
      let multiplier = 0.4;
      if (viewArea.lat === userPoint.lat && viewArea.lng === userPoint.lng) {
        multiplier = 0.7;
      }
      const bounds = {
        east: viewArea.lng + boundDist * multiplier,
        north: viewArea.lat + boundDist * multiplier,
        south: viewArea.lat - boundDist * multiplier,
        west: viewArea.lng - boundDist * multiplier,
      };
      map.fitBounds(bounds);
    }
  }, [viewArea]);
  //zooms map to show all found weather points
  const bounds = {
    east: userPoint.lng + boundDist * 0.7,
    north: userPoint.lat + boundDist * 0.7,
    south: userPoint.lat - boundDist * 0.7,
    west: userPoint.lng - boundDist * 0.7,
  };
  return (
    <Map
      mapId="mainMap"
      style={{
        width: "min(100vw, 1000px)",
        flexGrow: 1,
        border: "1px inset black",
      }}
      colorScheme="DARK"
      defaultCenter={{ lat: userPoint.lat, lng: userPoint.lng }}
      defaultBounds={bounds}
      onClick={() => {
        setViewArea({ lat: userPoint.lat, lng: userPoint.lng });
        setSelectedLocation(null);
        setShowList(false);
      }}
      disableDefaultUI
    >
      <AdvancedMarker
        key="centerPointMarker"
        position={{ lat: userPoint.lat, lng: userPoint.lng }}
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
  );
}

export default function APIHolder() {
  return (
    <APIProvider apiKey={googleApiKey}>
      <GoogleMap />
    </APIProvider>
  );
}
