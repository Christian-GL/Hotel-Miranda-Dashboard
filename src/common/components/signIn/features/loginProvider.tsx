
import React from "react"
import { useContext, createContext } from "react"
import { useDispatch } from "react-redux"

import { AppDispatch } from "../../../redux/store.ts"
import { LoginContextTypeInterface } from '../interfaces/loginContextTypeInterface.ts'
import { LoginProviderInterface } from '../interfaces/loginProviderInterface.ts'
import { LoginThunk } from "./loginThunk.ts"


const loginOptionsContext = createContext<LoginContextTypeInterface | undefined>(undefined)

export const useLoginOptionsContext = (): LoginContextTypeInterface => {
    const context = useContext(loginOptionsContext)
    if (!context) {
        throw new Error('useLoginOptionsContext must be used within a LoginProvider')
    }
    return context
}

export const LoginProvider = ({ children }: LoginProviderInterface) => {

    const dispatchRedux = useDispatch<AppDispatch>()

    const tryLogin = async (user: string, password: string): Promise<boolean> => {
        const loginData = { email: user, password: password }
        const result = await dispatchRedux(LoginThunk(loginData))

        if (LoginThunk.fulfilled.match(result)) {
            const tokenPayload: string = result.payload.token
            localStorage.setItem('token', tokenPayload)
            localStorage.setItem('userEmail', user)
            return true
        }
        else return false
    }

    const logout = (): void => {
        localStorage.removeItem('token')
        localStorage.removeItem('userEmail')
    }

    const isAuthenticated = () => {
        if (localStorage.getItem('token')) {
            return true
        }
        return false
    }


    return (
        <loginOptionsContext.Provider value={{ tryLogin, logout, isAuthenticated }}>
            {children}
        </loginOptionsContext.Provider>
    )
}