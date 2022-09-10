const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.addUser = catchAsync(async (req, res) => {
  req.body.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  let newUser = await User.create(req.body);
  newUser = newUser.toObject();
  delete newUser.password;

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
