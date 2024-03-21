import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('isLogged'));
  const [currUser, setCurrUser] = useState(sessionStorage.getItem('user'));



  console.log('loggedIn Value: ', loggedIn);
  return (
    <>
      <Routes>
        <Route path='/' element={loggedIn ? <ChatPage /> : <LoginPage setCurrUser={() => { setCurrUser(sessionStorage.getItem('user')) }}
          toggleIsLogged={() => setLoggedIn(sessionStorage.getItem('isLogged'))} />
        } />
        <Route path='/register' element={<RegistrationPage />} />
      </Routes>
    </>
  );
}

export default App;
