const express = require("express");
const { getUserWithEmail } = require("../db/queries/login");
const { addUser } = require("../db/queries/addUser");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post("/signup", (req, res) => {
  const encryptedPassword = bcrypt.hashSync(req.body.password, 12)
  const details = {
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: encryptedPassword,
  };
  getUserWithEmail(req.body.email).then(data => {
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
      return res.json(3);
    }
    return res.json(data);
  })
});

router.get("/test", (req, res) => {
  const password = "password";
  // console.log("password: ", bcrypt.hashSync("password", 10))
  getUserWithEmail("123@test.com").then((data) => {
    if (!data) {
      return res.json("No results found");
    }
    if (bcrypt.compareSync(password, data.password) === false) {
      return res.json("Invalid Password");
    }
    return res.json(data);
  })
})

router.get("/", (req, res) => {
  getUserWithEmail("123@test.com").then(data => {
    res.json(data);
    if (!data) {
      console.log("empty");
    }
  })
})

module.exports = router;