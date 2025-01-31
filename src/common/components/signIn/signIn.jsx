
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as signInJS from "./signIn.js"
import { useLoginOptionsContext } from "./features/loginProvider.jsx";


export const SignIn = () => {

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

        <signInJS.SectionPageSignIn>

            <signInJS.IconHotel />

            <signInJS.Form onSubmit={handleSubmit}>
                <signInJS.LabelText>Username
                    <signInJS.InputText
                        placeholder="admin"
                        onChange={(e) => setUserEmail(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signInJS.LabelText>
                <signInJS.LabelText>Password
                    <signInJS.InputText type="password"
                        placeholder="1234"
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signInJS.LabelText>
                <signInJS.ButtonSignIn type="submit" data-cy="submit-button">Sign In</signInJS.ButtonSignIn>
            </signInJS.Form>

        </signInJS.SectionPageSignIn>

    );
}