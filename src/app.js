require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mensRoutes = require("../routes/mens");
const mainRoutes = require("../routes/main");
const cookieParser  = require("cookie-parser");

const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
require("../db/conn");

const port = process.env.PORT || 9000;
const app = express();
app.use(express.static(templatePath));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
app.use(mensRoutes);
app.use(mainRoutes);

app.listen(port, () => {
  console.log("Server ready to listn at port : ", port);
});
