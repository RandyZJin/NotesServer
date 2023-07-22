const rateLimit = require('express-rate-limit');
require("dotenv").config();
const express  = require("express");
const app = express(); 
const port = 3000;
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json());
app.use(limiter);

const authRoutes = require("./routes/auth.js");

app.use("/api/auth", authRoutes);

app.get("/", function(req, res){
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
