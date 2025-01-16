
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as su from "./signUp.js"


export const SignUp = () => {

    const [userName, setUserName] = useState('admin');              // PARA AGILIZAR EL LOGIN:
    const [userPassword, setUserPassword] = useState('1234');       // PARA AGILIZAR EL LOGIN:
    // const [userName, setUserName] = useState('');
    // const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault();
        if (userName === 'admin' && userPassword === '1234') {
            navigate('/dashboard')
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            localStorage.removeItem('isAuthenticated');
            alert('tas ekivokao')
        }
    }

    return (

        <su.SectionPageSignUp>

            <su.IconHotel />

            <su.Form onSubmit={handleSubmit}>
                <su.LabelUsername>Username
                    <su.InputUsername
                        placeholder="admin"
                        // value={userName}
                        onChange={(e) => setUserName(e.currentTarget.value)}
                    />
                </su.LabelUsername>
                <su.LabelPassword>Password
                    <su.InputPassword
                        placeholder="1234"
                        // value={userPassword}
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                    />
                </su.LabelPassword>
                <su.ButtonSignUp type="submit">Sign Up</su.ButtonSignUp>
            </su.Form>

        </su.SectionPageSignUp>

    );
}