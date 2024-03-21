import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";
import axios from 'axios';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setUsernameError('');
        setPasswordError('');

        let valid = true;

        if ('' === username) {
            setUsernameError('\nUsername cannot be empty');
            valid = false;
        }
        if ('' == password) {
            setPasswordError('Password cannot be empty');
            valid = false;
        }
        if (password.length < 5) {
            setPasswordError('Password must be 6+ characters in length');
            valid = false;
        }
        if (password != passwordConfirm) {
            setPasswordError('Passwords must match');
            valid = false;
        }
        if (valid) {
            setUsernameError('');
            setPasswordError('');
            axios.post('http://127.0.0.1:8000/register', {
                'username': username,
                'password': password
            })
                .then((res) => {
                    setPasswordError('Successful registration');
                    console.log(res.status);
                    navigate('/');
                })
                .catch(() => {
                    setUsername('');
                    setPassword('');
                    setPasswordConfirm('');
                    setPasswordError('Unsuccessful registration');
                })
        }
    }

    return (
        <div className='loginPage'>
            <div className='loginTitle'>
                <h2>Register</h2>
            </div>
            <br />
            <form autoComplete='off' className='registrationForm' id='registrationForm' onSubmit={handleSubmit}>
                <div className='inputContainer'>
                    <input className='inputTextfield' name='username' value={username} placeholder='Enter username' onChange={(event) => {
                        setUsername(event.target.value)
                    }} />
                </div>
                <label className="errorLabel">{usernameError}</label>
                <br />
                <div className='inputContainer'>
                    <input className='inputTextfield' name='password' type='password' value={password} placeholder='Enter password' onChange={(event) => {
                        setPassword(event.target.value)
                    }} />
                </div>
                <br />
                <div className='inputContainer'>
                    <input className='inputTextfield' type='password' value={passwordConfirm} placeholder='Confirm password' onChange={(event) => {
                        setPasswordConfirm(event.target.value)
                    }} />
                </div>
                <label className="errorLabel">{passwordError}</label>
                <div className='inputContainer'>
                    <button type='submit' className='submit'>REGISTER</button>
                </div>
            </form>
            <a href='/'>Back</a>
        </div>
    )
}

export default RegistrationPage;