const express = require("express");
const route = new express.Router();
const Mens100M = require("../moduls/mens");
const Users = require("../moduls/users");
const bcrypt = require("bcryptjs");

route.get("/mens", async (req, res) => {
  try {
    const data = await Mens100M.find();
    if (data.length === 0) {
      return res.status(400).send("mens not found.");
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/mens/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send("ID is required.");
    }
    const data = await Mens100M.findById({ _id: req.params.id });
    if (data.length === 0) {
      return res.status(400).send("mens not found.");
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/add", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is null.");
    }
    const men = new Mens100M(req.body);
    const data = await men.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/sign-up", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is null.");
    }
    if (req.body.password === req.body.cpassword) {
      try {
        const user = new Users(req.body);
        const token = await user.genrateAuthToken();
        console.log("token: ", token);

        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 600000),
          secure: true,
          httpOnly: true,
        });
        console.log("cookie: ", req.cookies);

        const data = await user.save();

        // res.render("index");
        res.redirect("/");
      } catch (error) {
        console.log("error:: ", error);
        res.status(400).send(error);
      }
    } else {
      res.send("Password and confirm password not match.");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/login", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is null.");
    }
    const { email, password } = req.body;
    const usr = await Users.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, usr.password);
    const token = await usr.genrateAuthToken();
    console.log("token: ", token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      secure: true,
      httpOnly: true,
    });

    if (isMatch) {
      res.redirect("/");
    } else {
      res.send("Invalid email or password.");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

route.patch("/mens/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send("ID is required.");
    }
    if (!req.body) {
      return res.status(400).send("Request body is null.");
    }

    const men = await Mens100M.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!men) {
      return res.status(404).send("men not found");
    }
    res.send(men);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.delete("/mens/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send("ID is required.");
    }
    const men = await Mens100M.findById({ _id: req.params.id });
    if (!men) {
      res.status(400).send("Men already deleted.");
    } else {
      const men = await Mens100M.findByIdAndDelete({ _id: req.params.id });
      if (!men) {
        res.status(400).send("Men already deleted.");
      }
      res.send(men);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
