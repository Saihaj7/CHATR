import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";
import axios from 'axios';

function LoginPage({ toggleIsLogged, setCurrUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    //const [loggedIn, setLoggedIn] = useState(false);

    //const navigate = useNavigate();



    const handleSubmit = async (event) => {
        event.preventDefault();
        setUsernameError('');
        setPasswordError('');
        let valid = true;
        if ('' === username) {
            setUsernameError('Username cannot be empty');
            valid = false;
        }
        if ('' == password) {
            setPasswordError('Password cannot be empty');
            valid = false
        }
        if (username.indexOf(' ') >= 0) {
            setUsernameError('Username cannot contain spaces');
            valid = false;
        }
        if (password.indexOf(' ') >= 0) {
            setPasswordError('Password cannot contain spaces');
            valid = false;
        }

        if (valid) {
            setUsernameError('');
            setPasswordError('');
            sessionStorage.setItem('user', '');
            sessionStorage.setItem('isLogged', 0);
            axios.post('http://127.0.0.1:8000/login', {
                'username': username,
                'password': password
            })
                .then((res) => {
                    setPasswordError('Successful login');
                    console.log(res.status);
                    setCurrUser(username);
                    toggleIsLogged();
                    sessionStorage.setItem('user', username);
                    sessionStorage.setItem('isLogged', 1);
                })
                .catch(() => {
                    setUsername('');
                    setPassword('');
                    setPasswordError('Invalid login');
                })
        }






    }
    return (
        <div className='loginPage'>
            <div className='loginTitle'>
                <h2>Login</h2>
            </div>
            <br />
            <form autoComplete='off' className='loginForm' id='loginForm' onSubmit={handleSubmit}>
                <div className='inputContainer'>
                    <input className='inputTextfield' name='username' id='username' value={username} placeholder='Enter username' onChange={(event) => {
                        setUsername(event.target.value)
                    }} />
                </div>
                <label className="errorLabel">{usernameError}</label>
                <br />
                <div className='inputContainer'>
                    <input className='inputTextfield' name='password' id='password' type='password' value={password} placeholder='Enter password' onChange={(event) => {
                        setPassword(event.target.value)
                    }} />
                </div>
                <label className="errorLabel">{passwordError}</label>
                <div className='inputContainer'>
                    <button type='submit' className='submit'>LOGIN</button>
                </div>
            </form>
            <a href='/register'>Register here</a>
        </div>
    )
}

export default LoginPage;