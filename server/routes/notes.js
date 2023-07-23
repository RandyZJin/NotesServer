const express = require("express");
const { getNotesForUser, getNotesById } = require("../db/queries/getNotes");
const router = express.Router();

router.get("/:id", (req, res) => {
  let userID = 1;
  if (req.body.userID) {
    userID = req.body.userID;
  }
  getNotesById(userID, req.params.id).then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

router.get("/", (req, res) => {
  let userID = 1;
  if (req.body.userID) {
    userID = req.body.userID;
  }
  getNotesForUser(userID).then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
