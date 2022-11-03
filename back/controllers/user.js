const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const mailValidator = require("email-validator");
const passValidator = require("password-validator");
const fs = require('fs');
const jwt = require('jsonwebtoken');

require("dotenv").config();             /* Accès aux variables d'environnement */

const jwt_decode = require('jwt-decode')

var schemaPWD = new passValidator();
schemaPWD
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Password0000', 'Qwerty12', 'Azerty00', 'Azerty1234']);

exports.getAllUsers = (req, res, next) => {
    UserModel.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }))
};

exports.create_user = (req, res, next) => {
    if(!mailValidator.validate(req.body.email)) { 
        throw  `Adresse email invalide : ${req.body.email}` 
    }
    else if (!schemaPWD.validate(req.body.password)) { 
        throw  `Mot de passe invalide : ${req.body.password}` 
    }
    else {
        bcrypt.hash(req.body.password, 10)        
        .then(pwd => {
            if (req.body.photo) {
                // Si un nom de fichier est renseigné pour la photo, on prefixe la valeur reçue..
                req.body.photo = `${req.protocol}://${req.get("host")}/pictures/profiles/${req.body.photo}`
            }

            const user = new UserModel ({
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: pwd,
                photo: req.body.photo,
                isAdmin: false
            });

            user.save()
            .then(() => res.status(201).json({ message : 'Utilisateur créé !' }))
            .catch(() => res.status(400).json({ message : 'Erreur de requête' }))
        })
        .catch(() => { return res.status(500).json({ message : error }) } )
    }    
};

exports.connect_user = (req, res, next) => {
    UserModel.findOne({ email: req.body.email })
    .then(reponse => {
        if (!reponse) {
            /* L'e-mail ne correspond à aucun utilisateur existant */
            return res.status(401).json({ message : 'Connection refusée' });
        }

        bcrypt.compare(req.body.password, reponse.password) 
        .then(valid => {
            if (!valid) {
                /* Le mot de passe ne correspond pas au login saisi. */
                return res.status(401).json({ message: 'Connection refusée' });
            } 
           
            const accessToken = jwt.sign({ user: reponse }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});             

            res.status(200).json({
                accessToken,
                reponse
            })
        })
        .catch(error => res.status(400).json({ message : 'Erreur bCrypt' }));
    })
    .catch(error => res.status(500).json({ message : error }));
};

exports.refresh = (req, res) => {
    const authHeader = req.headers.authorization;    
    var token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message : 'Accès expiré' })
  
    var decoded = jwt_decode(token);
    var decoded_exp = (decoded.exp)*1000;
    var today = new Date().getTime()

    console.log('REFRESH => \r\n', decoded);

    if (decoded_exp < today) return res.status(401).json({ message : 'Votre session a expiré' })
    
    // Le token est toujours valide
    const newToken = { ...decoded }
    delete newToken.user.password
    console.log('NEW TOKEN => \r\n', newToken);
    return res.status(200).json({ message: 'Votre session est toujours active', content: newToken })
};

exports.getById = (req, res, next) => {    
    UserModel.findOne({ _id: req.params.id })
    .then((UserModel) => {
        res.status(200).json(UserModel)
    })
    .catch(error => {
        res.status(404).json({ message : 'Non trouvé' })
    });
};

exports.updateUser = (req, res) => { 
    UserModel.findOne({ _id: req.params.id })
    .then((result) => {       
        var contenu = result; 
        contenu.pseudo = req.body.pseudo;
        contenu.email = req.body.email;

        /* Seulement si l'image de profil est modifiée */ 
        if (req.file) {
            fs.unlink(`pictures/profiles/${result.photo}`, () => { 
                console.log('Ancienne image supprimée : ', result.photo);
            })
        }

        if (req.file) { contenu.photo = req.file.filename; }

        UserModel.updateOne({ _id: req.params.id }, contenu)
        .then(() => {
            const accessToken = jwt.sign({ user: contenu }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
            res.status(200).json({ message : 'Post modifié !', content: contenu, token: accessToken })
        })
        .catch((err) => res.status(400).json({ message : `Erreur de mise à jour\r\n${err}` }))
    })
    .catch((err) => res.status(500).json({ message : `Erreur mongoose\r\n${err}` }))
};