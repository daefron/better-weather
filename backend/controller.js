import { fetchCoords, fetchTimezone, fetchSuburb } from "./apiCalls.js";
import { coordinateMaker } from "./coordinateMaker.js";

//when user manually inputs location
async function postManual(req, res) {
  const { userInput, radiusKMInput, radiusDensity } = req.body;
  console.log(`Getting request with location: ${userInput}`);

  const coordinates = await fetchCoords(userInput);

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
}

//when user uses current location
async function postAuto(req, res) {
  const { coords } = req.body;
  console.log(`Getting request with location: ${coords}`);
  const suburbData = await fetchSuburb([coords]);
  if (!suburbData) {
    errorReset;
  }
  const suburb = suburbData[0].suburb;
  console.log(`Sent result for: ${coords}`);
  return res.json({
    result: JSON.stringify({
      suburb: suburb,
    }),
  });
}

async function dataProcessing(coordinates, radiusKMInput, radiusDensity) {
  const timezone = await fetchTimezone(coordinates.geometry.location);
  // if (!timezone) errorReset();

  const weatherCoords = coordinateMaker(
    coordinates.geometry.location,
    radiusKMInput / 554,
    Math.round(radiusKMInput / 10),
    radiusDensity
  );

  const locations = await fetchSuburb(weatherCoords);
  // if (!locations) errorReset();

  return { timezone: timezone, locations: locations };
}

export { postManual, postAuto };
