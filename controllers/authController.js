const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const MyError = require("../utils/MyError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  delete user.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  let { userName, password } = req.body;
  password = crypto.createHash("sha256").update(password).digest("hex");

  // 1) Check if email and password exist
  if (!userName || !password) {
    return next(new MyError("Please provide userName and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = (await User.findOne({ userName })).toObject();

  if (!user || user.password != password) {
    return next(new MyError("Incorrect userName or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new MyError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  let currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new MyError("The user belonging to this token does no longer exist.", 401)
    );
  }
  currentUser = currentUser.toObject();
  delete currentUser.password;
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
