/* Importation de la dépendance native 'http' de Node.Js */
const http = require("http");

/* Lier le fichier app.js */
const app = require("./app.js");

/* Permet d'intercepter les variables d'environnement du projet (données sensibles), 
   ici le PORT recommandé + paramètres d'authentification mongodb */
require("dotenv").config();


//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/* Réglage du port à utiliser */
const port = normalizePort(process.env.PORT);
app.set("port", port);


const errorHandler = (error) => {
  //errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
  if (error.syscall !== "listen") { throw error }

  const address = server.address();
  const bind =
      typeof address === "string" ? "pipe " + address : "port: " + port;

      switch (error.code) {
        case "EACCES":
            console.error(bind + " requiert une élévation des privilèges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " est déjà en cours d'utilisation.");
            process.exit(1);
            break;
        default:
            throw error;
      }
};

// Lier l'application au serveur
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Ecoute sur le " + bind);
});

server.listen(port); // Ecouteur d'évènements */


/* Rq : NODEMON Surveille le système de fichiers et redémarre automatiquement le processus. */