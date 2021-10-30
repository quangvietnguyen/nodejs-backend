const uuid = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    return next(e);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(e);
  }

  if (existingUser) {
    return next(new HttpError("User exists already", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    return next(e);
  }

  const createUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createUser.save();
  } catch (e) {
    return next(e);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, email: createUser.email },
      "secretnumberone",
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(e);
  }

  res
    .status(201)
    .json({ userId: createUser.id, email: createUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(e);
  }

  if (!existingUser) {
    return next(new HttpError('Could not login!', 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    return next(e);
  }

  if (!isValidPassword) {
    return next(new HttpError("Loggin failed", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secretnumberone",
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(e);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
