const express = require("express");
const { body } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    body("name").not().isEmpty(),
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
