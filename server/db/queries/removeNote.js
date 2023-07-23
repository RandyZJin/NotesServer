const db = require("../index");

const removeNote = function (noteID) {
  const queryString =`
    DELETE FROM notes
    WHERE id = $1
    RETURNING *
    ;
    `;
  return db
    .query(queryString, [
      noteID
    ])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { removeNote };