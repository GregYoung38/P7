const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
require("dotenv").config();

module.exports = (req, res, next) => {
    try {        
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) throw 'Token non fourni';

            // [info] Verify décode entièrement le token et restitue les informations [user] + iat/exp
            const openedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            // [info] Vérifier le délai d'expiration
            if (openedToken.exp < openedToken.iat) throw 'Token expiré';

            // [info] Vérifier l'exactitude des infos avec la DB
            const user = UserModel.findOne({ _id: openedToken.user._id })

            if (user === null) throw "Utilisateur non-trouvé";

            req.auth = { userId: openedToken.user._id }
            next()
        }
    } 
    catch (e) {
        return res.status(400).json({ message: e });
    }
};