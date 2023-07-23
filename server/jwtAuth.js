const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.AUTH_KEY;
const secretRefreshKey = process.env.REFRESH_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token is invalid or has expired
    }

    req.user = user; // Attach the user object to the request for use in later middleware/routes
    next();
  });
}

module.exports = authenticateToken;