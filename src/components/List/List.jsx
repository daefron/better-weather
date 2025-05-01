import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useWeatherState } from "../../hooks/WeatherContext";

export default function List() {
  const { showList, setShowList } = useWeatherState();
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100% - 2px)",
        position: "relative",
        width: "min(90vw, 450px)",
        marginRight: "max(-90vw, -452px)",
        right: showList ? "min(90vw, 450px)" : 0,
        transition: "right 1s ease",
        flexGrow: 1,
        backgroundColor: "rgba(31,53,42,1)",
        border: "outset 2px black",
        zIndex: 50,
      }}
    >
      <button
        style={{
          width: 30,
          marginLeft: "-30px",
          height: 80,
          alignSelf: "center",
          zIndex: 100,
          borderRight: "none",
        }}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        <FontAwesomeIcon
          icon={showList ? faChevronRight : faChevronLeft}
          style={{
            pointerEvents: "none",
            color: "#dcfff9",
            height: 20,
          }}
        />
      </button>
    </div>
  );
}
