const rateLimit = require('express-rate-limit');
require("dotenv").config();
const express  = require("express");
const app = express(); 
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // requests per window
	standardHeaders: true, 
	legacyHeaders: false,
});

app.use(express.json());
app.use(limiter);

const authRoutes = require("./routes/auth.js");
const notesRoutes = require("./routes/notes.js");

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", function(req, res){
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
