const express = require("express");
const placesControllers = require("../controllers/places-controllers");
const router = express.Router();

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlacesByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:placeId", placesControllers.updatePlaceById);

router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = router;
