
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as signUpJS from "./signUp.js"


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

        <signUpJS.SectionPageSignUp>

            <signUpJS.IconHotel />

            <signUpJS.Form onSubmit={handleSubmit}>
                <signUpJS.LabelText>Username
                    <signUpJS.InputText
                        placeholder="admin"
                        // value={userName}
                        onChange={(e) => setUserName(e.currentTarget.value)}
                    />
                </signUpJS.LabelText>
                <signUpJS.LabelText>Password
                    <signUpJS.InputText
                        placeholder="1234"
                        // value={userPassword}
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                    />
                </signUpJS.LabelText>
                <signUpJS.ButtonSignUp type="submit">Sign Up</signUpJS.ButtonSignUp>
            </signUpJS.Form>

        </signUpJS.SectionPageSignUp>

    );
}