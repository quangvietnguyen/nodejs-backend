const express = require("express");
const { body } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const router = express.Router();

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch("/:placeId", placesControllers.updatePlaceById);

router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = router;
