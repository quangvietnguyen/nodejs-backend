const axios = require("axios");
const HttpError = require("../models/http-error");
const token =
  "pk.eyJ1IjoidmlldGN0aSIsImEiOiJja2twejJ0c2gwY2F2MnFvNW00enZ3NHl2In0.TVhNUtbDIMYHTZUSLmjpAQ";

const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${token}`
  );

  const data = response.data;

  if (!data || data.status === "NO RESULTS") {
    const error = new HttpError(
      "Could not find location for this address.",
      422
    );
    throw error;
  }
  let location = { lng: 0, lat: 0 };
  location.lng = data.features[0].geometry.coordinates[0];
  location.lat = data.features[0].geometry.coordinates[1];
  return location;
};

module.exports = getCoordsForAddress;
