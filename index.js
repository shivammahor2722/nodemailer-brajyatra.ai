const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const emailRoutes = require("./routes/email");
const contactRoutes = require("./routes/contact");

app.use("/api/email", emailRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
