const express = require("express");
const { body } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    body("name").not().isEmpty(),
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 5 }),
    body("places").not().isEmpty()
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
