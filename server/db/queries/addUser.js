const db = require("../index");

const addUser = function (user) {
  const queryString =`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) 
    RETURNING *
    `;
  return db
    .query(queryString, [
      user.name,
      user.email,
      user.password,
    ])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { addUser };