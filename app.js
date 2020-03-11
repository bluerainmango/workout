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

// View router
// app.use("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "hehe"
//   });
// });

// API routers
app.use("/api/plans", planRouter);
app.use("/api/exercises", exerciseRouter);

module.exports = app;
