const fs = require("fs");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.addUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
