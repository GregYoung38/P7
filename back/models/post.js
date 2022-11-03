const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema_for_Post = mongoose.Schema({
    idAuthor: { 
        type: String, 
        required: true
    },
    content: { 
        type: String, 
        required: false 
    },
    sharedImg: { 
        type: String, 
        required: false 
    },
    alt: { 
        type: String, 
        required: false 
    },
    date_creation : { 
        type : Date,
        default: new Date()
    },
    // likes: { 
    //     type: Number, 
    //     required: true, 
    //     default: 0 
    // },
    usersLiked: { 
        type: [String], 
        required: true 
    },
});

Schema_for_Post.plugin(uniqueValidator);

module.exports = mongoose.model("post", Schema_for_Post);