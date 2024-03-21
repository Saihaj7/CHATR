const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");



app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let clients = []
io.on("connection", (socket) => {

    console.log(`user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    socket.on("init", (data) => {
        const { userid } = data;
        clients[userid] = socket.id;
    })

    socket.on("sendMessage", async (data) => {
        const { userid, receiverid, content } = data;
        console.log(userid, receiverid, content);

        let msg = await Messages.create({ userid: userid, receiverid: receiverid, content: content });
        if (clients[userid] != null) {
            io.to(clients[userid]).emit("messages", msg)
        }
        if (clients[receiverid] != null) {
            io.to(clients[receiverid]).emit("messages", msg)
        }

    })

    socket.on("sendContactRequest", async (data) => {
        const { username, contact } = data;
        console.log(username, contact);

        const user = await Users.find({ 'username': contact }).exec();
        // if user is found and contact not already in contacts

        if (user.length != 0 && !user[0].contacts.includes(username) && !user[0].contactRequests.includes(username)) {
            await Users.findOneAndUpdate({ 'username': contact }, { $push: { 'contactRequests': [username] } });
            if (clients[contact] != null) {
                io.to(clients[contact]).emit("receiveContactRequest", username);
            }
        } else {
            console.log("already in contact list or already sent request or doesn't exist");
        }
    })
    socket.on("acceptContactRequest", async (data) => {
        const { username, contact } = data;

        await Users.findOneAndUpdate({ 'username': contact }, { $push: { 'contacts': [username] } });

        await Users.findOneAndUpdate({ 'username': username }, { $push: { 'contacts': [contact] }, $pull: { 'contactRequests': contact } });

        if (clients[contact] != null) {
            io.to(clients[contact]).emit("newContact", username);
        }

    })
});


server.listen(4000, () => {
    console.log("socket server listening at 4000")
});

const Messages = require("./models/messages");
const Users = require("./models/users")


mongoose.connect('mongodb://127.0.0.1:27017/chatApp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!");
    })
    .catch(() => {
        console.log("MONGO ERROR!!!");
        console.log(err);
    })

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ 'username': username, 'password': password }).exec();
    if (user == null) {
        Users.create({ 'username': username, 'password': password, 'contacts': [] });
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await Users.findOne({ 'username': username, 'password': password }).exec();
    if (user != null) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})

app.get('/messages/:userid/contact/:receiverid', async (req, res) => {
    const { userid, receiverid } = req.params;

    await Messages.find({ $or: [{ userid: userid, receiverid: receiverid }, { userid: receiverid, receiverid: userid }] }).exec()
        .then((data) => {
            res.status(200);
            res.json(data);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        })
})


// GET a user with a given username
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    await Users.find({ 'username': username }).exec()
        .then((data) => {
            res.status(200);
            res.json(data);
        })
        .catch((error) => {
            res.sendStatus(400);
        })
})
// GET the array of contacts for a given user
app.get('/contacts/:username', async (req, res) => {
    const { username } = req.params;

    await Users.find({ 'username': username }).select('contacts').exec()
        .then((data) => {
            res.status(200);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
})


app.get('/contacts/requests/:username', async (req, res) => {
    const { username } = req.params;
    console.log('getting contact reqs');
    await Users.find({ 'username': username }).select('contactRequests').exec()
        .then((data) => {
            res.status(200);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
});

app.post('/contacts/decline', async (req, res) => {
    const { username, contact } = req.body;

    await Users.findOneAndUpdate({ 'username': username }, { $pull: { 'contactRequests': contact } })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
});


/*
app.get('/', (req, res) => {
    res.send("hello world!!");
});
*/

app.listen(8000, () => {
    console.log("Listening on port 8000");
})

/* 
bulk requests are made through GET/POST, live requests are done via sockets 
*/