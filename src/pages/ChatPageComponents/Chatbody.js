import React from 'react';
import { useState, useEffect, useRef } from 'react';
import "../ChatPage.css";
import axios from 'axios';



function Chatbody({ currContact, socket }) {
    const [newMessage, setNewMessage] = useState("");
    const [allMsg, setAllMsg] = useState([]);
    const bottomMessages = useRef(null);

    // bulk fetch for message history 
    useEffect(() => {
        if (currContact != '') {
            axios.get(`http://127.0.0.1:8000/messages/${sessionStorage.getItem('user')}/contact/${currContact}`)
                .then((res) => {
                    let newContent = [];
                    for (let msg of res.data) {
                        if (msg.userid == sessionStorage.getItem('user')) {
                            newContent.push(<li className='userMessage'>{msg.content}</li>);
                        } else {
                            newContent.push(<li className='receiverMessage'>{msg.content}</li>);
                        }
                    }
                    setAllMsg(newContent);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [currContact]);
    // if a new message is send by the current contact to this user while logged in
    useEffect(() => {
        socket.on("messages", (data) => {
            console.log(data);
            let newContent = [...allMsg];
            if (data.userid == sessionStorage.getItem('user')) {
                newContent.push(<li className='userMessage'>{data.content}</li>);
            } else {
                newContent.push(<li className='receiverMessage'>{data.content}</li>);
            }
            setAllMsg(newContent);
        });
    })
    // sends a new message from this user to the current contact, if they are logged in they will receive it
    // via socket, otherwise it will be bulk fetched for them on log in
    const sendMessage = (event) => {
        event.preventDefault();
        console.log(currContact);
        if (newMessage != '' && currContact != undefined) {
            socket.emit("sendMessage", { userid: sessionStorage.getItem('user'), receiverid: currContact, content: newMessage });
        }
        setNewMessage('');
    }

    // auto scroll to last message sent
    const scrollToLast = () => {
        bottomMessages.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    };
    useEffect(() => {
        scrollToLast();
    }, [allMsg]);

    return (
        <div className='chatBody'>
            <div className="bodyText">
                <ul>
                    {allMsg}
                    <div ref={bottomMessages} />
                </ul>
            </div>
            <div className="inputForm">
                <form autoComplete='off' className='msgForm' id='msgForm' onSubmit={sendMessage}>
                    <input name="msg" id='msg' type="text" value={newMessage} onChange={(event) => {
                        setNewMessage(event.target.value)
                    }} placeholder="Write a message" />
                    <button type="submit" className='submit'>SEND MESSAGE</button>
                </form>
            </div>
        </div>);
}

export default Chatbody;

