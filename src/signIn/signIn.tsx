
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import * as signInStyles from "./signInStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifyError } from '../common/components/toastify/errorPopup/toastifyError'
import { useLoginOptionsContext } from "./features/loginProvider"


export const SignIn = () => {

    const adminDefaultValueTesting = 'admindefault@gmail.com'   // Valor por defecto para logeo rápido en testeos
    const userDefaultValueTesting = 'userdefault@gmail.com'     // Valor por defecto para logeo rápido en testeos
    const passwordDefaultValueTesting = 'Abcd1234.'             // Valor por defecto para logeo rápido en testeos.
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>(adminDefaultValueTesting)
    const [password, setPassword] = useState<string>(passwordDefaultValueTesting)
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
                        placeholder={`${adminDefaultValueTesting} // ${userDefaultValueTesting}`}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        data-cy="email-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.LabelText>Password
                    <signInStyles.InputText type="password"
                        placeholder={passwordDefaultValueTesting}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        data-cy="password-input"
                    />
                </signInStyles.LabelText>
                <signInStyles.ButtonSignIn type="submit" data-cy="submit-button">Sign In</signInStyles.ButtonSignIn>
            </signInStyles.Form>

        </signInStyles.SectionPageSignIn>
    </>)
}