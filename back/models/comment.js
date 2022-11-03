const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema_for_Comment = mongoose.Schema({
    refId: { 
        type: String, 
        required: true
    },
    userId: { 
        type: String, 
        required: true
    },
    content: { 
        type: String, 
        required: false 
    },
    date_creation : { 
        type : Date
    },
    usersLiked: { 
        type: [String], 
        default: [],
        required: true 
    },
});

Schema_for_Comment.plugin(uniqueValidator);

module.exports = mongoose.model("comment", Schema_for_Comment);