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

module.exports = { getNotesForUser };