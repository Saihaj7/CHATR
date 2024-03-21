const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 15,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 15
    },
    contacts: {
        type: [String],
    },
    contactRequests: {
        type: [String]
    }
})

const Users = new mongoose.model("Users", userSchema);

module.exports = Users;