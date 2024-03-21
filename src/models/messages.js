const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    receiverid: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Messages = mongoose.model('Messages', messageSchema);


module.exports = Messages;