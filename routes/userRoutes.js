const express = require("express");
const userController = require("./../controllers/userController");
const userRouter = express.Router();
//routes
userRouter
  .route("/")
  //.get(productController.getAllProducts)
  .post(userController.addUser);
//productRouter.route("/:id").get(productController.getProductById);

module.exports = userRouter;
