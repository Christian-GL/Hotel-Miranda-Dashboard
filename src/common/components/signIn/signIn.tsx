
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import * as signInStyles from "./signInStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifyError } from "../toastify/errorPopup/toastifyError.tsx"
import { useLoginOptionsContext } from "./features/loginProvider.tsx"


export const SignIn = () => {

    const navigate = useNavigate()
    const [userEmail, setUserEmail] = useState<string>('admin')
    const [userPassword, setUserPassword] = useState<string>('1234')
    const { tryLogin } = useLoginOptionsContext()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const loginSuccessful = tryLogin(userEmail, userPassword)
        loginSuccessful ?
            navigate('/dashboard') :
            ToastifyError('Email or password wrong')
    }

    return (<>
        <ToastContainer />

        <signInStyles.SectionPageSignIn>

            <signInStyles.IconHotel />

            <signInStyles.Form onSubmit={handleSubmit}>
                <signInStyles.LabelText>Username
                    <signInStyles.InputText
                        placeholder="admin"
                        onChange={(e) => setUserEmail(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.LabelText>Password
                    <signInStyles.InputText type="password"
                        placeholder="1234"
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.ButtonSignIn type="submit" data-cy="submit-button">Sign In</signInStyles.ButtonSignIn>
            </signInStyles.Form>

        </signInStyles.SectionPageSignIn>
    </>)
}