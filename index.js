const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

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

app.post("/api/v1/products", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/products.json`)
  );
  products.push(req.body);
  fs.writeFileSync(`${__dirname}/data/products.json`, JSON.stringify(products));

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

app.get("/api/v1/products/:id", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/products.json`)
  );

  const foundProduct = products.find((p) => p.id == req.params.id);
  if (foundProduct) {
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
