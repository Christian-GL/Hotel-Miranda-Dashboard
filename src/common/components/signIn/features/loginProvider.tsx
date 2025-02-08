
import React from "react"
import { useReducer, useContext, createContext } from "react"

import { StateInterface } from '../interfaces/stateInterface.ts'
import { ActionInterface } from "../interfaces/actionInterface.ts"
import { LoginContextTypeInterface } from '../interfaces/loginContextTypeInterface.ts'
import { LoginProviderInterface } from '../interfaces/loginProviderInterface.ts'
import accountsData from '../data/accountsData.json'


const loginReducer = (state: StateInterface, action: ActionInterface): StateInterface => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, loggedUser: action.payload }

        case 'LOGOUT':
            return { ...state, loggedUser: null }

        default:
            return state
    }
}

const loginOptionsContext = createContext<LoginContextTypeInterface | undefined>(undefined)

export const useLoginOptionsContext = (): LoginContextTypeInterface => {
    const context = useContext(loginOptionsContext)
    if (!context) {
        throw new Error('useLoginOptionsContext must be used within a LoginProvider')
    }
    return context
}

export const LoginProvider = ({ children }: LoginProviderInterface) => {

    const initialState: StateInterface = {
        loggedUser: localStorage.getItem('isAuthenticated') ? { userEmail: '', userPassword: '' } : null
    }
    const [state, dispatch] = useReducer<React.Reducer<StateInterface, ActionInterface>>(loginReducer, initialState)

    const tryLogin = (userEmail: string, userPassword: string): boolean => {
        const finded = accountsData.find((user) => userEmail === user.email && userPassword === user.password)
        if (finded) {
            dispatch({
                type: 'LOGIN',
                payload: { userEmail, userPassword }
            })
            localStorage.setItem('isAuthenticated', 'true')
            return true
        }
        else return false
    }

    const logout = (): void => {
        dispatch({ type: 'LOGOUT' })
        localStorage.removeItem('isAuthenticated')
    }

    const isAuthenticated = () => {
        if (localStorage.getItem('isAuthenticated')) {
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