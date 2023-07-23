const db = require("../index");

const removeNote = function (userId, noteID) {
  const queryString =`
    DELETE FROM notes
    WHERE owner_id = $1 AND id = $2
    RETURNING *
    ;
    `;
  return db
    .query(queryString, [
      userId, noteID
    ])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { removeNote };