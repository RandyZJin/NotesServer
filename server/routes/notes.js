const express = require("express");
const { getNotesForUser, getNotesById } = require("../db/queries/getNotes");
const { addNote } = require("../db/queries/addNote");
const { updateNote } = require("../db/queries/updateNote");
const router = express.Router();

router.put("/:id", (req, res) => {
  console.log(req.body, req.params.id)
  const note = {
    id: req.params.id,
    content: req.body.note
  };
  updateNote(note).then((data) => {
    if (!data) {
      res.send("note saving failed");
    } else {
      res.json(data);
    }
  });
});

router.post("/", (req, res) => {
  let userID = 1;
  console.log(req.body)
  if (req.body.userID) {
    userID = req.body.userID;
  }
  addNote(userID, req.body.note).then((data) => {
    if (!data) {
      res.send("note saving failed");
    } else {
      res.json(data);
    }
  });
});

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
