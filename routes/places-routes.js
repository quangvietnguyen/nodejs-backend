const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "CN Tower",
    description: "Highest site in Canada",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Toronto_-_ON_-_Toronto_Harbourfront7.jpg",
    address: "290 Bremner Blvd, Toronto, ON M5V 3L9",
    location: {
      lng: -79.3852341,
      lat: 43.6430207,
    },
    creator: "u1",
  },
];

router.get("/:placeId", (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    const error = new Error("Could not find a place for the provided id.");
    error.code = 404;
    throw error;
  }
  res.json({ place });
});

router.get("/user/:userId", (req, res, next) => {
  const uesrId = req.params.userId;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === uesrId;
  });
  if (!place) {
    const error = new Error("Could not find a place for the provided id.");
    error.code = 404;
    return next(error);
  }
  res.json({ place });
});

module.exports = router;
