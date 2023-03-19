const express = require("express");

const helmet = require("helmet");

const mongoose = require("mongoose");

const saucesRoutes = require("./routes/sauces");

const userRoutes = require("./routes/user");

const app = express();

const path = require("path");

require("dotenv").config();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,  PATCH, OPTIONS"
  );
  next();
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); //intercepte le content type json

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);

app.use("/api/auth", userRoutes);

module.exports = app;
