const uuid = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Viet",
    email: "test@sheridancollege.ca",
    password: "tester",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(e);
  }

  if (existingUser) {
    return next(new HttpError("User exists already", 422));
  }

  const createUser = new User({
    name,
    email,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg/769px-Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg",
    password,
    places,
  });

  try {
    await createUser.save();
  } catch (e) {
    return next(e);
  }

  res.status(201).json({ user: createUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(e);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Loggin failed", 422));
  }


  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
