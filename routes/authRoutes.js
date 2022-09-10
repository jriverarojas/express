const express = require("express");
const authController = require("./../controllers/authController");
const authRouter = express.Router();
//routes
authRouter.route("/login").post(authController.login);

module.exports = authRouter;
