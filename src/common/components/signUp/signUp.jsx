
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as signUpJS from "./signUp.js"
import { useLoginOptionsContext } from "./features/loginProvider.jsx";


export const SignUp = () => {

    const [userEmail, setUserEmail] = useState('admin');
    const [userPassword, setUserPassword] = useState('1234');
    const { tryLogin } = useLoginOptionsContext();

    const navigate = useNavigate()
    const handleSubmit = e => {
        e.preventDefault();

        tryLogin(userEmail, userPassword) ?
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
                    />
                </signUpJS.LabelText>
                <signUpJS.LabelText>Password
                    <signUpJS.InputText type="password"
                        placeholder="1234"
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                    />
                </signUpJS.LabelText>
                <signUpJS.ButtonSignUp type="submit">Sign Up</signUpJS.ButtonSignUp>
            </signUpJS.Form>

        </signUpJS.SectionPageSignUp>

    );
}