const express = require("express");
const { searchNotes } = require("../db/queries/searchNotes");
const router = express.Router();

router.get("/", (req, res) => {
  let userID = 1;
  if (req.body.userID) {
    userID = req.body.userID;
  }
  const query = req.query.q;
  searchNotes(userID, query).then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

module.exports = router;