const db = require("../index");

const getNotesForUser = function (id) {
  const queryString =`
    SELECT *
    FROM notes
    WHERE owner_id = $1
    `;
  return db
    .query(queryString, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows;
    });
};

const getNotesById = function (userID, noteId) {
  const queryString =`
    SELECT *
    FROM notes
    WHERE owner_id = $1
    AND id = $2
    `;
  return db
    .query(queryString, [userID, noteId])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    });
};

const getSharedNote = function (noteId) {
  const queryString =`
    SELECT id, contents, created_date
    FROM notes
    WHERE shared = true
    AND id = $1
    `;
  return db
    .query(queryString, [noteId])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    });
};

module.exports = { getNotesForUser, getNotesById, getSharedNote };