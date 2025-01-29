
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as signUpJS from "./signUp.js"
import { useLoginOptionsContext } from "./features/loginProvider.jsx";


export const SignUp = () => {

    const navigate = useNavigate()
    const [userEmail, setUserEmail] = useState('admin');
    const [userPassword, setUserPassword] = useState('1234');
    const { tryLogin } = useLoginOptionsContext();

    const handleSubmit = (e) => {
        e.preventDefault()

        const loginSuccessful = tryLogin(userEmail, userPassword);
        loginSuccessful ?
            navigate('/dashboard') :
            alert('Email or password wrong')
    }

    return (

        <signUpJS.SectionPageSignUp>

            <signUpJS.IconHotel />

            <signUpJS.Form onSubmit={handleSubmit}>
                <signUpJS.LabelText>Username
                    <signUpJS.InputText
                        placeholder="admin"
                        onChange={(e) => setUserEmail(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signUpJS.LabelText>
                <signUpJS.LabelText>Password
                    <signUpJS.InputText type="password"
                        placeholder="1234"
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signUpJS.LabelText>
                <signUpJS.ButtonSignUp type="submit" data-cy="submit-button">Sign Up</signUpJS.ButtonSignUp>
            </signUpJS.Form>

        </signUpJS.SectionPageSignUp>

    );
}