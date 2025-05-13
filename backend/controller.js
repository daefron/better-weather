import { fetchCoords, fetchTimezone, fetchSuburb } from "./apiCalls.js";
import { coordinateMaker } from "./coordinateMaker.js";

//when user manually inputs location
async function postManual(req, res) {
  try {
    const { userInput, radiusKMInput, radiusDensity } = req.body;
    console.log(`Getting request with location: ${userInput}`);

    const coordinates = await fetchCoords(userInput);
    if (!coordinates) throw new Error("Coordinates not found.");
    const finalData = await dataProcessing(
      coordinates,
      radiusKMInput,
      radiusDensity
    );
    console.log(finalData.locations);

    console.log(`Sent result for: ${userInput}`);
    return res.json({
      result: JSON.stringify({
        timezone: finalData.timezone,
        locations: finalData.locations,
      }),
    });
  } catch (error) {
    console.error("Failed in postManual:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}

//when user uses current location
async function postAuto(req, res) {
  try {
    const { coords } = req.body;
    console.log(`Getting request with location: ${coords}`);
    const suburbData = await fetchSuburb([coords]);
    if (suburbData) throw new Error("No results found for this location");
    const suburb = suburbData[0].suburb;
    console.log(`Sent result for: ${coords}`);
    return res.json({
      result: JSON.stringify({
        suburb: suburb,
      }),
    });
  } catch (error) {
    console.error("Failed in postAuto:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function dataProcessing(coordinates, radiusKMInput, radiusDensity) {
  const timezone = await fetchTimezone(coordinates.geometry.location);
  if (!timezone) throw new Error("Failed to fetch timezone data");

  const weatherCoords = coordinateMaker(
    coordinates.geometry.location,
    radiusKMInput / 554,
    Math.round(radiusKMInput / 10),
    radiusDensity
  );

  const locations = await fetchSuburb(weatherCoords);
  if (!locations) throw new Error("Failed to fetch suburb data");

  return { timezone: timezone, locations: locations };
}

export { postManual, postAuto };
