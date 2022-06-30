const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/olympic")
  .then(() => {
    console.log("DB Coonected.");
  })
  .catch((e) => {
    console.log("DB not Coonected.");
  });
