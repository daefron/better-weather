const circleSettings = {
  radius: 5, //amount of circles to calculate
};

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

function destinationPoint(lat, lng, distanceKm, bearingDegrees) {
  const R = 6371; // Radius of Earth in km
  const bearingRad = toRad(bearingDegrees);
  const latRad = toRad(lat);
  const lngRad = toRad(lng);

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceKm / R) +
      Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad)
  );

  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
      Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  const newLat = toDeg(newLatRad);
  const newLng = toDeg(newLngRad);

  return [newLat, newLng];
}

//creates array of coordinate points in radius around user input
export function coordinateMaker(inputCoords, radiusInput) {
  //user inputted location
  const centerLat = inputCoords.current.lat;
  const centerLng = inputCoords.current.lng;

  const pointHolder = [[centerLat, centerLng]];
  const baseSpacingKm = 50;

  for (let radius = 1; radius <= circleSettings.radius; radius++) {
    const distance = radius * radiusInput * 100; //distance in km
    const circumference = 2 * Math.PI * distance; //circumfrence of the circle
    const pointCount = Math.max(4, Math.round(circumference / baseSpacingKm));

    const angleSlice = 360 / pointCount;
    for (let point = 0; point < pointCount; point++) {
      const angle = angleSlice * point; // angle in degrees
      const [lat, lng] = destinationPoint(
        centerLat,
        centerLng,
        distance,
        angle
      );
      pointHolder.push([lat, lng]);
    }
  }
  return pointHolder;
}
