const db = require("../index");

const updateNote = function (userId, note) {
  const queryString =`
    UPDATE notes contents
    SET contents = $2
    WHERE id = $1
    AND owner_id = $3
    RETURNING *
    ;
    `;
  return db
    .query(queryString, [
      note.id, note.contents, userId
    ])
    .then((result) => {
      return result.rows[0];
    });
};

const shareNote = function (userId, noteId) {
  const queryString =`
  UPDATE notes
  SET shared = TRUE
  WHERE id = $1
  AND owner_id = $2
  RETURNING *
  ;
  `;
return db
  .query(queryString, [
    noteId, userId
  ])
  .then((result) => {
    return result.rows[0];
  });
};


module.exports = { updateNote, shareNote };