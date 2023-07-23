const express = require("express");
const { searchNotes } = require("../db/queries/searchNotes");
const router = express.Router();
const authenticateToken = require("../jwtAuth");

router.get("/", authenticateToken, (req, res) => {
  let userID = req.user.userId;
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