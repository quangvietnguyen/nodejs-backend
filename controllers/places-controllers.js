const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const mongoose = require("mongoose");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "CN Tower",
    description: "Highest site in Canada",
    // imageUrl:
    //   "https://upload.wikimedia.org/wikipedia/commons/9/96/Toronto_-_ON_-_Toronto_Harbourfront7.jpg",
    address: "290 Bremner Blvd, Toronto, ON M5V 3L9",
    location: {
      lng: -79.3852341,
      lat: 43.6430207,
    },
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(e);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (e) {
    return next(e);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (e) {
    return next(e);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Toronto_-_ON_-_Toronto_Harbourfront7.jpg",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (e) {
    return next(e);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(e);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (e) {
    return next(e);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(e);
  }

  try {
    await place.remove();
  } catch (e) {
    return next(e);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
