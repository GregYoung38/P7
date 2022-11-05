const postModel = require("../models/post");
const commentModel = require("../models/comment");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { log } = require("console");

require("dotenv").config(); /* Accès aux variables d'environnement */

exports.getPosts = async (req, res, next) => {
    try {
        const allPost = await postModel.find().sort({ $natural: -1 }).limit(req.body.limit).exec();
        res.status(200).json(allPost);
    } 
    catch (e) {
        res.status(404).json({ e });
    }
};

exports.getOnePost = async (req, res, next) => {
    try {
        const onePost = await postModel.findOne({ _id: req.params.id }).exec();
        if (onePost === null) { throw `Le post n'existe pas` }
        res.status(200).json(onePost);
    } 
    catch (e) {
        res.status(404).json({ e });
    }
};

exports.create_new = async (req, res) => {
    try {
        const userId = req.auth.userId;

        var photo = "";
        if (req.file) {
            photo = `${req.protocol}://${req.get("host")}/pictures/posts/${ req.file.filename }`;
        }

        const post = new postModel({
            ...req.body,
            idAuthor: userId,
            sharedImg: photo
        });

        const savePost = await post.save();
        res.status(201).json({ message: "Post créé !", content: post });
    } 
    catch (e) {
        res.status(400).json({ message: `Erreur mongoose\r\n${e}`, body: post });
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const post = await postModel.findOne({ _id: req.params.id }).exec();
        //console.log(post);

        //if (userId !== post.idAuthor) { throw `Vous n'êtes pas l'auteur du POST` }
        let newPost = {
            ...req.body,
            idAuthor: userId
        }

        if (req.file) {
            /* Seulement si l'image est modifiée */
            newPost = {
                ...req.body,
                idAuthor: userId,
                sharedImg: `${req.protocol}://${req.get("host")}/pictures/posts/${ req.file.filename }`
            };
        }

        // On recherche le post update dans la base de donnée et on le renvoie dans la réponse
        // new:true permet de renvoyer le post APRES l'update.
        // (Par défaut il sera renvoyé avant en utilisant findByIdAndUpdate)

        const updatePost = await postModel.findByIdAndUpdate({ _id: req.params.id }, { ...newPost }, { new: true }).exec();
        if (updatePost === null) { throw `Le post n'existe pas` }
        res.status(200).json({ message : 'Post modifié !', content: updatePost });
    } 
    catch (e) {
        res.status(400).json({ message: e });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const user = await postModel.findOne({ _id: req.params.id }).exec();

        // On récupère le nom du fichier image dans l'URL
        const filename = user.sharedImg.split("/pictures/posts/")[1];

        fs.unlink(`pictures/posts/${filename}`, async () => {
            const suppressionPost = await postModel.deleteOne({ _id: req.params.id }).exec();
            const deleteComment = await commentModel.deleteMany({ refId: req.params.id }).exec();
            res.status(204).send();
        });
    } 
    catch (e) {
        res.status(400).json({ message: e });
    }
};

exports.reactPost = (req, res, next) => {
  const userId = req.auth.userId;
  const postId = req.params.id;
  const like = req.body.like; // Reçoit ici 0 ou 1

  var modele;
  req.body.models === "posts" ? (modele = postModel) : (modele = commentModel);

  console.log(
    "*****************************  LIKES  *****************************\r\n" +
      "userId : " +
      userId +
      "\r\npostId : " +
      postId +
      "\r\nlike : " +
      like +
      "\r\n" +
      "*******************************************************************"
  );
  /*
        Utilisation des opérateurs de mise à jour de MongoDB : $inc, $push et $pull
        https://www.mongodb.com/docs/manual/reference/operator/update-array/
    */

  modele
    .findOne({ _id: postId }) //Renvoie un document qui satisfait les critères de requête spécifiés sur la collection ou la vue
    .then((data) => {
        // Si l'utilisateur n'est pas dans la liste {usersLiked} et qu'il ajoute un LIKE
        if (!data.usersLiked.includes(userId) && like === 1) {
            modele
                .updateOne({ _id: postId },{ $push: { usersLiked: userId } })
                .then(() => res.status(201).json({ message: "added" }))
                .catch((error) => res.status(400).json({ error }));
        }

        // Si l'utilisateur est dans la liste {usersLiked} et qu'il enlève son LIKE
        if (data.usersLiked.includes(userId) && like === 0) {
            modele
                .updateOne({ _id: postId },{ $pull: { usersLiked: userId } })
                .then(() => res.status(201).json({ message: "deleted" }))
                .catch((error) => res.status(400).json({ error }));
        }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getComments = async (req, res, next) => {
    try {
        const readComment = await commentModel.find().limit(req.body.limit).exec();
        if (readComment === null) { throw `Il n'y a pas de commentaire` }
        res.status(200).json(readComment);
    } 
    catch (e) {
        res.status(404).json({ e });
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const commentObject = req.body;
        const postId = req.params.id;

        console.log(
          "*****************************  NEW COMMENT  *****************************\r\n" +
            "userId : " + userId +
            "\r\npostId : " + postId +
            "\r\ncontent : " + commentObject.content +
            "\r\n*************************************************************************"
        );

        const comment = new commentModel({
            ...commentObject,
            userId: userId,
            refId: req.params.id,
        });

        const saveComment = await comment.save();

        res.status(201).json({ content: saveComment });
    } 
    catch (e) {
        res.status(400).json({ e });
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const searchComment = await commentModel.findOne({ _id: req.params.id }).exec();

        if (searchComment === null) { throw `Le commentaire que vous voulez modifier n'existe pas` }
        //if (userId !== searchComment.userId) { throw `Vous n'êtes pas l'auteur du commentaire` }

        const update = { ...searchComment._doc, ...req.body };
        const updateComment = await commentModel.findByIdAndUpdate({ _id: req.params.id }, update, { new: true }).exec();

        res.status(201).json(updateComment);
    } 
    catch (e) {
        res.status(400).json({ e });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const searchComment = await commentModel.findOne({ _id: req.params.id }).exec();

        if (searchComment === null) { throw `Le commentaire que vous voulez modifier n'existe pas` }

        commentModel.deleteOne({ _id: req.params.id })
        .then( () => { res.status(204).send() })
        .catch((error) => res.status(400).json({ message: 'Erreur de suppression de la publication\r\n' + error }));
    } 
    catch (e) {
        res.status(400).json({ e });
    }
};
