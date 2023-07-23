const db = require("../index");

const searchNotes = function (userID, keywords) {
  const matchingResults = [];
  const queryString = `
    SELECT *
    FROM notes
    WHERE owner_id = $1
    `;
  return db.query(queryString, [userID])
  .then((result) => {
    for (row of result.rows) {
      for (let keyword of keywords.split(" ")) {
        if (
          row.contents.toLowerCase().includes(keyword.toLowerCase()) &&
          !matchingResults.includes(row)
        ) {
          matchingResults.push(row);
        }
      }
    }
    return matchingResults;
  });
};

module.exports = { searchNotes };