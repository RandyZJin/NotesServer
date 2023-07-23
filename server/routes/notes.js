const express = require("express");
const { getNotesForUser, getNotesById } = require("../db/queries/getNotes");
const { addNote } = require("../db/queries/addNote");
const { updateNote, shareNote } = require("../db/queries/updateNote");
const { removeNote } = require("../db/queries/removeNote");
const router = express.Router();

const authenticateToken = require("../jwtAuth");

router.delete("/:id", authenticateToken, (req, res) => {
  let userID = req.user.userId;
  removeNote(userID, req.params.id)
  .then(data => {
    res.json(data);
  })
  .catch(err => console.log(err));
});

router.post("/:id/share", authenticateToken, (req, res) => {
  let userId = req.user.userId;
  shareNote(userId, req.params.id)
  .then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

router.put("/:id", authenticateToken, (req, res) => {
  let userID = req.user.userId;
  const note = {
    id: req.params.id,
    contents: req.body.note
  };
  updateNote(userID, note).then((data) => {
    if (!data) {
      res.send("note saving failed");
    } else {
      res.json(data);
    }
  });
});

router.post("/", authenticateToken, (req, res) => {
  let userID = req.user.userId;
  addNote(userID, req.body.note).then((data) => {
    if (!data) {
      res.send("note saving failed");
    } else {
      res.json(data);
    }
  });
});

router.get("/:id", authenticateToken, (req, res) => {
  let userID = req.user.userId;
  getNotesById(userID, req.params.id).then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

router.get("/", authenticateToken, (req, res) => {
  let userID = req.user.userId;
  getNotesForUser(userID).then((data) => {
    if (!data) {
      res.send("no notes found for user");
    } else {
      res.json(data);
    }
  });
});

module.exports = router;