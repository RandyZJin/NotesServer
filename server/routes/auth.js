const express = require("express");
const { getUserWithEmail } = require("../db/queries/login");
const { addUser } = require("../db/queries/addUser");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.AUTH_KEY;
const secretRefreshKey = process.env.REFRESH_KEY;

router.post("/signup", (req, res) => {
  const encryptedPassword = bcrypt.hashSync(req.body.password, 10)
  const details = {
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: encryptedPassword,
  };
  getUserWithEmail(req.body.email).then(data => {
    if (data) {
      return res.send("This email is already registered!");
    }
    if (!data) {
      addUser(details);
    }
  })
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.json(1);
  }
  getUserWithEmail(email).then((data) => {
    if (!data) {
      return res.json(2);
    }
    if (bcrypt.compareSync(password, data.password) === false) {
      return res.status(401).send("authentication failed");
    }
    console.log("log in success");
    const token = jwt.sign({ userId: data.id, name: data.name, email: data.email }, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign({userId: data.id, name: data.name, email: data.email}, secretRefreshKey, { expiresIn: '1d' });

    // Include the token in the response
    const currentUser = { id: data.id, name: data.name, email: data.email, accessToken: token, refreshToken };
    return res.json(currentUser);
  })
  .catch((error) => {
    console.error('Error:', error);
    return res.status(500).send("Server Error");
  });
});

router.get("/test", (req, res) => {
  const password = "password";
  // console.log("password: ", bcrypt.hashSync("password", 10))
  getUserWithEmail(req.body.email).then((data) => {
    if (!data) {
      return res.json("No results found");
    }
    if (bcrypt.compareSync(password, data.password) === false) {
      return res.status(401).send("authentication failed");
    }
    return res.json(data);
  })
})

router.get("/", (req, res) => {
  getUserWithEmail("mike@test.com").then(data => {
    res.json(data);
    if (!data) {
      console.log("empty");
    }
  })
})

module.exports = router;