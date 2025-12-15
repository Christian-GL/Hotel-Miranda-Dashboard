
import { useContext, createContext } from "react"
import { useDispatch } from "react-redux"

import { AppDispatch } from "../../common/redux/store"
import { LoginContextTypeInterface } from '../interfaces/loginContextTypeInterface'
import { LoginProviderInterface } from '../interfaces/loginProviderInterface'
import { LoginThunk } from "./loginThunk"


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

    const tryLogin = async (email: string, password: string): Promise<boolean> => {
        const loginData = { email: email, password: password }
        const tokenAndUserData = await dispatchRedux(LoginThunk(loginData))
        if (LoginThunk.fulfilled.match(tokenAndUserData)) {
            localStorage.setItem('token', tokenAndUserData.payload.token)
            localStorage.setItem('loggedUserID', tokenAndUserData.payload.loggedUserID)
            localStorage.setItem('role', tokenAndUserData.payload.role)
            return true
        }
        else return false
    }
    const logout = (): void => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedUserID')
        localStorage.removeItem('role')
    }

    const isAuthenticated = () => {
        if (localStorage.getItem('token')) {
            return true
        }
        return false
    }
    const getRole = (): string | null => {
        return localStorage.getItem('role')
    }


    return (
        <loginOptionsContext.Provider value={{ tryLogin, logout, isAuthenticated, getRole }}  >
            {children}
        </loginOptionsContext.Provider>
    )
}