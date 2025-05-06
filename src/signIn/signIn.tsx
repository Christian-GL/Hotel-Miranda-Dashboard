
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import * as signInStyles from "./signInStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifyError } from '../common/components/toastify/errorPopup/toastifyError.tsx'
import { useLoginOptionsContext } from "./features/loginProvider.tsx"


export const SignIn = () => {

    const navigate = useNavigate()
    const [userSet, setUserSet] = useState<string>('Ashly.Rice92@gmail.com')
    const [passwordSet, setPasswordSet] = useState<string>('Abcd1234.')
    const { tryLogin } = useLoginOptionsContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const loginSuccessful = await tryLogin(userSet, passwordSet)
        loginSuccessful ?
            navigate('/dashboard') :
            ToastifyError('Email or password wrong')
    }

    return (<>
        <ToastContainer />

        <signInStyles.SectionPageSignIn>

            <signInStyles.IconHotel />

            <signInStyles.Form onSubmit={handleSubmit}>
                <signInStyles.LabelText>Email
                    <signInStyles.InputText
                        placeholder="email@gmail.com"
                        onChange={(e) => setUserSet(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.LabelText>Password
                    <signInStyles.InputText type="password"
                        placeholder="Password"
                        onChange={(e) => setPasswordSet(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.ButtonSignIn type="submit" data-cy="submit-button">Sign In</signInStyles.ButtonSignIn>
            </signInStyles.Form>

        </signInStyles.SectionPageSignIn>
    </>)
}