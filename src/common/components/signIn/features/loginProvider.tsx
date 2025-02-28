
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

    const tryLogin = async (userEmail: string, userPassword: string): Promise<boolean> => {
        const loginData = { userEmail: userEmail, userPassword: userPassword }
        const tokenAndUserData = await dispatchRedux(LoginThunk(loginData))

        if (LoginThunk.fulfilled.match(tokenAndUserData)) {
            const tokenPayload: string = tokenAndUserData.payload.token
            localStorage.setItem('token', tokenPayload)
            localStorage.setItem('loggedUserID', JSON.stringify(tokenAndUserData.payload.loggedUserID))
            return true
        }
        else return false
    }

    const logout = (): void => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedUserID')
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