require("dotenv").config();
const express  = require("express");
const app = express(); 
const port = 3000;

app.use(express.json());

const authRoutes = require("./routes/auth.js");

app.use("/api/auth", authRoutes);

app.get("/", function(req, res){
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
