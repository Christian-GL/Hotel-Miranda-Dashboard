
import { useReducer, useContext, createContext } from "react"
import accountsData from '../data/accountsData.json'


const loginReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, loggedUser: action.payload }

        case 'LOGOUT':
            return { ...state, loggedUser: null }

        default:
            return state
    }
}

const loginOptionsContext = createContext()
export const useLoginOptionsContext = () => {
    return useContext(loginOptionsContext)
}

export const LoginProvider = ({ children }) => {

    const initialState = {
        loggedUser: localStorage.getItem('isAuthenticated') ? true : null
    }
    const [state, dispatch] = useReducer(loginReducer, initialState)

    const tryLogin = (userEmail, userPassword) => {
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

    const logout = () => {
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