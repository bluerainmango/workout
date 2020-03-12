const path = require("path");
const express = require("express");
const morgan = require("morgan");

// Import Routers
const planRouter = require("./routes/planRoutes");
const exerciseRouter = require("./routes/exerciseRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API routers
app.use("/api/plans", planRouter);
app.use("/api/exercises", exerciseRouter);

// View router
app.use("/", (req, res) => {
  res.status(200).send("index.html");
});

module.exports = app;
