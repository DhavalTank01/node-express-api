require("dotenv").config();
const express = require("express");
const auth = require("../middleware/auth");
const route = new express.Router();

route.get("/", async (req, res) => {
  res.render("index");
});

route.get("/profile", auth, async (req, res) => {
  res.render("profile");
});

route.get("/logout", auth, async (req, res) => {
  try {
    const tokens = req.user.tokens;
    // logout from cuurent devices
    // req.user.tokens = tokens.filter((cele) => {
    //   return cele.token !== req.token;
    // });

    // logout from all devices
    req.user.tokens = [];
    await req.user.save();
    req.token = undefined;
    console.log("Logout successfully.");
    res.clearCookie("jwt");
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

route.get("/add", async (req, res) => {
  res.render("add");
});

route.get("/login", async (req, res) => {
  res.render("login");
});

route.get("/sign-up", async (req, res) => {
  res.render("sign-up");
});

module.exports = route;
