const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/productRoutes");
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//routes
app.use("/api/v1/products/", productRouter);

module.exports = app;
