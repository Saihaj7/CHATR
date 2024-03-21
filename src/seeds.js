const Messages = require("./models/messages");

const mongoose = require("mongoose");


mongoose.connect('mongodb://127.0.0.1:27017/chatApp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!");
    })
    .catch(() => {
        console.log("MONGO ERROR!!!");
        console.log(err);
    })

/*
const m = new Messages({ userid: "joe", receiverid: "bob", data: "hey Bob!!!" });

m.save()
    .then(m => {
        console.log(m);
    })
    .catch(e => {
        console.log(e);
    })
*/

const seedMessages = [
    { userid: "bob", receiverid: "joe", content: "hey Joe!!1", messageid: 0 },
    { userid: "bob", receiverid: "joe", content: "wasssup", messageid: 1 },
    { userid: "joe", receiverid: "bob", content: "nothin much man", messageid: 2 }
]

Messages.insertMany(seedMessages)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })