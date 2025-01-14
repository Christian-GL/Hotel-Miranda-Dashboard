
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export const SignUp = () => {

    // PARA AGILIZAR EL LOGIN:
    const [userName, setUserName] = useState('admin');
    const [userPassword, setUserPassword] = useState('1234');
    // const [userName, setUserName] = useState('');
    // const [userPassword, setUserPassword] = useState('');
    const [adminName, setAdminName] = useState('admin');
    const [adminPassword, setAdminPassword] = useState('1234');
    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault();
        userName === adminName && userPassword === adminPassword ?
            navigate('/dashboard') :
            alert('tas ekivokao')
    }

    return (
        <section>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>Username
                    <div>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.currentTarget.value)}
                        />
                    </div>
                </label>
                <label>Password
                    <div>
                        <input
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.currentTarget.value)}
                        />
                        <button type="submit">Sign Up</button>
                    </div>
                </label>
            </form>
        </section>
    );
}