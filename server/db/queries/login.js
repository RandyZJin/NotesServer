const db = require("../index");

const getUsers = function () {
  const queryString = "SELECT * FROM users ORDER BY id";
  return db.query(queryString).then((data) => {
    return data.rows;
  });
};

const getUserWithEmail = function (email) {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { getUsers, getUserWithEmail };
