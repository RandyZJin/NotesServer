const rateLimit = require('express-rate-limit');
require("dotenv").config();
const express  = require("express");
const app = express(); 
const port = 3000;
const secretRefreshKey = process.env.REFRESH_KEY;
const jwt = require('jsonwebtoken');
const authenticateToken = require("./jwtAuth");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // requests per window
	standardHeaders: true, 
	legacyHeaders: false,
});

app.use(express.json());
app.use(limiter);

const authRoutes = require("./routes/auth.js");
const notesRoutes = require("./routes/notes.js");
const searchRoutes = require("./routes/search.js");

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/search", searchRoutes);

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(400);
  }

  jwt.verify(refreshToken, secretRefreshKey, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
		// { userId: data.id, name: data.name, email: data.email }
    const newAccessToken = jwt.sign({ userId: decoded.userId, name: decoded.name, email: decoded.email }, process.env.AUTH_KEY, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  });
});

app.get("/", function(req, res){
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
