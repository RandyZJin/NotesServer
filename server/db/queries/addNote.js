const db = require("../index");

const addNote = function (userID, note) {
  const queryString =`
    INSERT INTO notes (owner_id, contents)
    VALUES
    ($1, $2)
    ;
    `;
  return db
    .query(queryString, [
      userID,
      note
    ])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { addNote };