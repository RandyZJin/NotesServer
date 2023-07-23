const db = require("../index");

const updateNote = function (note) {
  const queryString =`
    UPDATE notes contents
    SET contents = $2
    WHERE id = $1
    RETURNING *
    ;
    `;
  return db
    .query(queryString, [
      note.id, note.content
    ])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { updateNote };