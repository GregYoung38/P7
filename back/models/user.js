const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema_for_user = mongoose.Schema({
    pseudo: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    photo: { 
        type: String, 
        required: false 
    },
    isAdmin: { 
        type: Boolean, 
        required: true 
    }
});

Schema_for_user.plugin(uniqueValidator);

module.exports = mongoose.model("user", Schema_for_user);