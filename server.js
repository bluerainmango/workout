const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB is successfully connected!");
  });

const app = require("./app");

app.listen(PORT, () => {
  console.log("listening...");
});
