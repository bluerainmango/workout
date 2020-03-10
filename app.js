const path = require("path");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("hello");
  next();
});

app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "hehe"
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
module.exports = app;
