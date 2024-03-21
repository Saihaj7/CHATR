import React from 'react';
import { useState, useEffect } from 'react';
import "./ChatPage.css";
import axios from 'axios';
import io from 'socket.io-client';

import Nav from './ChatPageComponents/Nav';
import Sidebar from './ChatPageComponents/Sidebar';
import Chatbody from './ChatPageComponents/Chatbody';

let socket = io.connect("http://localhost:4000");

/*
react
axios
express
mongoDB
sockets.io
react-router
*/

function Chatroom() {
    const [currContact, setCurrContact] = useState('');

    // telling server socket to add this client connection to its client array
    useEffect(() => {
        socket.emit("init", { userid: sessionStorage.getItem('user') });
    }, [])

    return (
        <div className="chatpage">
            <Nav />
            <div className='bodyContainer'>
                <Sidebar socket={socket}
                    currContact={currContact}
                    setCurrContact={setCurrContact}
                />
                <Chatbody socket={socket}
                    currContact={currContact} />
            </div>
        </div>
    );
}

export default Chatroom;