
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import * as signInStyles from "./signInStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifyError } from '../common/components/toastify/errorPopup/toastifyError'
import { useLoginOptionsContext } from "./features/loginProvider"


export const SignIn = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('admindefault@gmail.com')            // Valor por defecto para logeo rápido en testeos
    const [password, setPassword] = useState<string>('Abcd1234.')                   // Valor por defecto para logeo rápido en testeos
    const { tryLogin } = useLoginOptionsContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const loginSuccessful = await tryLogin(email, password)
        loginSuccessful.success
            ? navigate('/dashboard')
            : ToastifyError(loginSuccessful.error ?? 'Login failed')
    }

    return (<>
        <ToastContainer />

        <signInStyles.SectionPageSignIn>

            <signInStyles.IconHotel />

            <signInStyles.Form onSubmit={handleSubmit}>
                <signInStyles.LabelText>Email
                    <signInStyles.InputText
                        placeholder="email@gmail.com"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.LabelText>Password
                    <signInStyles.InputText type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.ButtonSignIn type="submit" data-cy="submit-button">Sign In</signInStyles.ButtonSignIn>
            </signInStyles.Form>

        </signInStyles.SectionPageSignIn>
    </>)
}