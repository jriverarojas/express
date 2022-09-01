const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT;

app.get("/api/v1/products", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/products.json`)
  );

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
