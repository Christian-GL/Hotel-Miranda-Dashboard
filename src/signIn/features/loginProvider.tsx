
import { useContext, createContext } from "react"
import { useDispatch } from "react-redux"

import { AppDispatch } from "../../common/redux/store"
import { LoginContextTypeInterface } from '../interfaces/loginContextTypeInterface'
import { LoginProviderInterface } from '../interfaces/loginProviderInterface'
import { LoginThunk } from "./loginThunk"
import { resetStore } from "../../common/redux/rootActions"
import { resetBookingAllStatus, resetBookingIdStatus } from "../../booking/features/bookingSlice"
import { resetRoomAllStatus, resetRoomIdStatus } from "../../room/features/roomSlice"
import { resetClientAllStatus, resetClientIdStatus } from "../../client/features/clientSlice"
import { resetUserAllStatus, resetUserIdStatus } from "../../user/features/userSlice"


const loginOptionsContext = createContext<LoginContextTypeInterface | undefined>(undefined)

export const useLoginOptionsContext = (): LoginContextTypeInterface => {
    const context = useContext(loginOptionsContext)
    if (!context) {
        throw new Error('useLoginOptionsContext must be used within a LoginProvider')
    }
    return context
}

export const LoginProvider = ({ children }: LoginProviderInterface) => {

    const dispatch = useDispatch<AppDispatch>()

    const tryLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        const result = await dispatch(LoginThunk({ email, password }))
        if (LoginThunk.fulfilled.match(result)) {
            localStorage.setItem('token', result.payload.token)
            localStorage.setItem('loggedUserID', result.payload.loggedUserID)
            localStorage.setItem('role', result.payload.role)
            dispatch(resetBookingAllStatus())
            dispatch(resetBookingIdStatus())
            dispatch(resetRoomAllStatus())
            dispatch(resetRoomIdStatus())
            dispatch(resetClientAllStatus())
            dispatch(resetClientIdStatus())
            dispatch(resetUserAllStatus())
            dispatch(resetUserIdStatus())
            return { success: true }
        }
        if (LoginThunk.rejected.match(result)) {
            return {
                success: false,
                message: result.payload?.message
            }
        }
        return { success: false, message: 'Unknown login error' }
    }
    const logout = (): void => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedUserID')
        localStorage.removeItem('role')
        window.dispatchEvent(new Event('logout'))
        dispatch(resetStore())
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