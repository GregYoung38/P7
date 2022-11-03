const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
};

/*  
    La constante "element" , sert à définir une configuration, qui indique à multer 
    où enregistrer les fichiers entrants (destination),
    configure le chemin et le nom de fichier pour les fichiers entrants.
    Le paramètre null indique à multer qu'il n'y a pas d'erreur.
*/
const element = multer.diskStorage({    
    destination: (req, file, callback) => {
        // Où enregistrer les fichiers ?
        // Selon l'URL de la requête entrante, on définit le sous-dossier de destination :
        var dest;
        (req.url.includes('/createPost') || req.url.includes('/updatePost')) 
            ? dest = 'pictures/posts' 
            : dest = 'pictures/profiles';
        callback(null, dest);
    },
    filename: (req, file, callback) => {
        /*  
            Remplacer les espaces vides du nom de fichier original par des underscores.
            Ajout de la date courante à la milliseconde près.
            Ajout de l'extension correspondant à la valeur de l'élément du dictionnaire MIME_TYPES.
        */
        const renew = file.originalname.split('#').join('');
        const name = renew.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype].toLowerCase();
        const name_only = name.replace(/\.[^/.]+$/, "");
        callback(null, name_only + Date.now() + '.' + extension);
    }
});

/*  
    Exporter l'élément multer entièrement configuré
    Indiquer que nous gérerons uniquement les téléchargements de fichiers image.
    La méthode single() crée un middleware qui capture les fichiers d'un certain type (passé en argument), 
    et les enregistre au système de fichiers du serveur à l'aide de l'élément configuré.
    Pour pouvoir appliquer notre middleware à nos routes, nous devrons les modifier quelque peu, 
    car la structure des données entrantes n'est pas tout à fait la même avec des fichiers et des données JSON.
    
    Accepte les fichiers de 5MB max. => 5 x 1024 x 1024 octets soit 5.242.880 octets 
*/
module.exports = multer({ storage : element, limits: {fileSize: 5242880}, }).single('sharedImg');