import React from 'react';
import "../ChatPage.css";

function Nav() {

    const signOutHandler = () => {
        sessionStorage.clear();
    }

    return (
        <div className="navigation">
            <nav>
                <ul>
                    <li className='title'>
                        CHATR
                    </li>
                    <div className='floatRight'>
                        <li>
                            <a onClick={signOutHandler} href='/'>Sign Out</a>
                        </li>
                    </div>
                </ul>
            </nav>
        </div >
    );
}

export default Nav;
