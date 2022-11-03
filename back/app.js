/* Facilite l'utilisation de l'objet http (déclaré dans server.js) */
const express = require("express");
const app = express();

/* Sécurisation des headers */
const helmet = require("helmet"); 
app.use(helmet());

/* Permet d'intercepter les variables d'environnement du projet (données sensibles) */
require("dotenv").config(); 


/* Facilite les interactions avec la base de données NoSql */
const mongoose = require("mongoose");

/* CONNECTION MONGODB */
mongoose
.connect
(
  `mongodb+srv://${process.env.MDB_LOGIN}:${process.env.MDB_PWD}@${process.env.MDB_CLSTR}.mongodb.net/${process.env.MDB_DATABASE}?retryWrites=true&w=majority`
)
.then(() => console.log("Connection à MongoDB réussie !"))
.catch(() => console.log("Connection à MongoDB échouée !"));


/* Contourne la limitation CORS pour tout type de requêtes */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth-Token, Content, Accept, Content-Type, Authorization, UID");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

/* Met à disposition l'intégralité de la réponse d'une requête ayant une entête json */
app.use(express.json()); 
app.use(express.urlencoded({ extended: true}));


/* Définition des routes principales -------------------- */
const routeUser = require("./routes/user");
app.use("/api/auth", routeUser);

const routePosts = require("./routes/posts");
app.use("/api/posts", routePosts);
/* ------------------------------------------------------ */


/* Fournit de nombreuses fonctionnalités très utiles pour accéder et interagir avec le système de fichiers */
const path = require("path"); 
app.use("/pictures", express.static(path.join(__dirname, "/pictures")));

module.exports = app;