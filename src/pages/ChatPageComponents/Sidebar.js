import React from 'react';
import { useState, useEffect } from 'react';
import "../ChatPage.css";
import axios from 'axios';


function Sidebar({ currContact, setCurrContact, socket }) {
    const [contactList, setContactList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [newContact, setNewContact] = useState('');
    const [showRequests, setShowRequests] = useState(false);

    //bulk fetch contactRequests for the current user
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/contacts/requests/' + sessionStorage.getItem('user'))
            .then((res) => {
                let newContent = [];
                for (let contactRequest of res.data[0].contactRequests) {
                    newContent.push(<li className='contactRequest'>
                        <div className='contactName'>{contactRequest.toUpperCase()}</div>
                        <div className='contactRequestButtons'>
                            <button onClick={() => acceptContact(contactRequest)} className='acceptRequest'>ACCEPT</button>
                            <button onClick={() => declineContact(contactRequest)} className='declineRequest'>DECLINE</button>
                        </div>
                    </li>);
                }
                setRequestList(newContent);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [showRequests])


    //bulk fetch contacts for the current user
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/contacts/' + sessionStorage.getItem('user'))
            .then((res) => {
                let newContent = [];
                if (currContact == "") {
                    setCurrContact(res.data[0].contacts[0]);
                }
                for (let contact of res.data[0].contacts) {
                    newContent.push(<li className={currContact == contact ? 'activeContact' : ""}>
                        <a
                            onClick={() => {
                                setCurrContact(contact)
                            }}>{contact.toUpperCase()} </a></li>);
                }
                setContactList(newContent);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [currContact]);

    //fetch contact requests or new contacts if the user is logged in while it occurs
    useEffect(() => {
        socket.on("receiveContactRequest", (data) => {
            let newContent = [...requestList];
            newContent.push(<li className='contactRequest'>
                <div className='contactName'>{data}</div>
                <div className='contactRequestButtons'>
                    <button onClick={() => acceptContact(data)} className='acceptRequest'>ACCEPT</button>
                    <button onClick={() => declineContact(data)} className='declineRequest'>DECLINE</button>
                </div>
            </li>);
            setRequestList(newContent);
        });
        socket.on("newContact", (data) => {
            console.log('contact request was accepted');
            let newContent = [...contactList];
            if (currContact === "") {
                setCurrContact(data);
            }
            newContent.push(<li className={currContact == data ? 'activeContact' : ""}>
                <a
                    onClick={() => {
                        setCurrContact(data)
                    }}>{data} </a></li>);
            setContactList(newContent);
        });

    });


    // sends a contact request to the specified user via socket, if they're logged in they will see it appear
    // instantly
    const handleAddContact = (event) => {
        event.preventDefault();
        if (newContact != '') {
            socket.emit("sendContactRequest", { 'username': sessionStorage.getItem('user'), 'contact': newContact });
            setNewContact('');
        }
    }
    // accepted a contact request, if the new contact is currently logged in they will see it appear
    // instantly
    const acceptContact = (contact) => {
        socket.emit("acceptContactRequest", { 'username': sessionStorage.getItem('user'), 'contact': contact });
        window.location.reload();

    }
    // sends a post request to decline the contact request
    const declineContact = (contact) => {
        axios.post('http://127.0.0.1:8000/contacts/decline', {
            'username': sessionStorage.getItem('user'),
            'contact': contact
        })
            .then((res) => {
                console.log(res.status);
            })
            .catch((res) => {
                console.log(res.status);
            })
        window.location.reload();
    }


    return (<div className='sidebar'>
        <div className='contactsToggle'>
            <button onClick={() => setShowRequests(!showRequests)} >{showRequests ? 'OPEN CONTACTS' : 'OPEN REQUESTS'}</button>
        </div>
        <div className='contactsContainer'>
            <div className='contacts'>
                <ul>
                    {showRequests ? requestList : contactList}
                </ul>
            </div>
            <div className='inputForm'>
                <form autoComplete='off' className='contactForm' id='contactForm' onSubmit={handleAddContact}>
                    <input name="newContact" id='newContact' type="text" placeholder="Add a contact"
                        value={newContact} onChange={(event) => {
                            setNewContact(event.target.value)
                        }} />
                    <button type="submit" className='submit'>SEND REQUEST</button>
                </form>
            </div>
        </div>
    </div>);
}


export default Sidebar;