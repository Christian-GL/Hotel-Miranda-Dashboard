
import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider } from 'styled-components'

import { getBookingAllStatus, getBookingApIError, getBookingIdStatus } from "booking/features/bookingSlice"
import { getClientAllStatus, getClientApiError, getClientIdStatus } from "client/features/clientSlice"
import * as headerStyles from "common/components/layout/headerStyles"
import * as layoutStyles from "common/components/layout/layoutStyles"
import * as sidebarStyles from "common/components/layout/sidebarMenuStyles"
import { ToastifyError } from "common/components/toastify/errorPopup/toastifyError"
import { ToastifyLoading } from "common/components/toastify/loadingPopup/toastifyLoading"
import { Theme } from "common/context/darkModeContext"
import { ApiStatus } from "common/enums/ApiStatus"
import { ThemeType } from "common/enums/themeType"
import { AppDispatch } from "common/redux/store"
import { themeDark, themeLight } from "common/styles/themes"
import { getRoomAllStatus, getRoomApiError, getRoomIdStatus } from "room/features/roomSlice"
import { useLoginOptionsContext } from 'signIn/features/loginProvider'
import { UserFetchByIDThunk } from "user/features/thunks/userFetchByIDThunk"
import { getUserAllStatus, getUserApiError, getUserIdData, getUserIdStatus } from "user/features/userSlice"


export const Layout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const location = useLocation()
    const { theme, setTheme } = useContext(Theme)
    const selectedTheme = theme === ThemeType.light ? themeLight : themeDark
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const bookingApiError = useSelector(getBookingApIError)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomByIdLoading: ApiStatus = useSelector(getRoomIdStatus)
    const roomApiError = useSelector(getRoomApiError)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const clientByIdLoading: ApiStatus = useSelector(getClientIdStatus)
    const clientApiError = useSelector(getClientApiError)
    const userById = useSelector(getUserIdData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const userByIdLoading: ApiStatus = useSelector(getUserIdStatus)
    const userApiError = useSelector(getUserApiError)
    const loggedUserID = localStorage.getItem('loggedUserID') || null

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/') }
        const savedTheme = localStorage.getItem("theme")
        savedTheme === null
            ? setTheme(ThemeType.dark)
            : setTheme(JSON.parse(savedTheme))
    }, [navigate, isAuthenticated, theme])
    useEffect(() => {
        if (loggedUserID && userByIdLoading === ApiStatus.idle) { dispatch(UserFetchByIDThunk(loggedUserID)) }
        else if (userByIdLoading === ApiStatus.fulfilled) {
            if (loggedUserID && loggedUserID !== userById._id && !routeIsActive('/users')) {
                dispatch(UserFetchByIDThunk(loggedUserID))
            }
        }
    }, [userByIdLoading, userById, loggedUserID])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.pending) { ToastifyLoading(1, 'Loading all booking data...') } else { toast.dismiss(1) }
        if (bookingByIdLoading === ApiStatus.pending) { ToastifyLoading(2, 'Loading booking data...') } else { toast.dismiss(2) }
        if (bookingAllLoading === ApiStatus.rejected && bookingApiError) { ToastifyError(bookingApiError.message) }
        if (bookingByIdLoading === ApiStatus.rejected && bookingApiError) { ToastifyError(bookingApiError.message) }
    }, [bookingAllLoading, bookingByIdLoading])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.pending) { ToastifyLoading(3, 'Loading all room data...') } else { toast.dismiss(3) }
        if (roomByIdLoading === ApiStatus.pending) { ToastifyLoading(4, 'Loading room data...') } else { toast.dismiss(4) }
        if (roomAllLoading === ApiStatus.rejected && roomApiError) { ToastifyError(roomApiError.message) }
        if (roomByIdLoading === ApiStatus.rejected && roomApiError) { ToastifyError(roomApiError.message) }
    }, [roomAllLoading, roomByIdLoading])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.pending) { ToastifyLoading(5, 'Loading all client data...') } else { toast.dismiss(5) }
        if (clientByIdLoading === ApiStatus.pending) { ToastifyLoading(6, 'Loading client data...') } else { toast.dismiss(6) }
        if (clientAllLoading === ApiStatus.rejected && clientApiError) { ToastifyError(clientApiError.message) }
        if (clientByIdLoading === ApiStatus.rejected && clientApiError) { ToastifyError(clientApiError.message) }
    }, [clientAllLoading, clientByIdLoading])
    useEffect(() => {
        if (userAllLoading === ApiStatus.pending) { ToastifyLoading(7, 'Loading all user data...') } else { toast.dismiss(7) }
        if (userByIdLoading === ApiStatus.pending) { ToastifyLoading(8, 'Loading user data...') } else { toast.dismiss(8) }
        if (userAllLoading === ApiStatus.rejected && userApiError) { ToastifyError(userApiError.message) }
        if (userByIdLoading === ApiStatus.rejected && userApiError) { ToastifyError(userApiError.message) }
    }, [userAllLoading, userByIdLoading])
    // useEffect(() => {
    //     if (bookingAllLoading === ApiStatus.pending) { ToastifyLoading(1, 'Loading all booking data...') } else { toast.dismiss(1) }
    //     if (bookingByIdLoading === ApiStatus.pending) { ToastifyLoading(2, 'Loading booking data...') } else { toast.dismiss(2) }
    //     if (bookingAllLoading === ApiStatus.rejected && bookingApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingApiError.message) }
    //     if (bookingByIdLoading === ApiStatus.rejected && bookingApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingApiError.message) }
    // }, [bookingAllLoading, bookingByIdLoading])
    // useEffect(() => {
    //     if (roomAllLoading === ApiStatus.pending) { ToastifyLoading(3, 'Loading all room data...') } else { toast.dismiss(3) }
    //     if (roomByIdLoading === ApiStatus.pending) { ToastifyLoading(4, 'Loading room data...') } else { toast.dismiss(4) }
    //     if (roomAllLoading === ApiStatus.rejected && roomApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomApiError.message) }
    //     if (roomByIdLoading === ApiStatus.rejected && roomApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomApiError.message) }
    // }, [roomAllLoading, roomByIdLoading])
    // useEffect(() => {
    //     if (clientAllLoading === ApiStatus.pending) { ToastifyLoading(5, 'Loading all client data...') } else { toast.dismiss(5) }
    //     if (clientByIdLoading === ApiStatus.pending) { ToastifyLoading(6, 'Loading client data...') } else { toast.dismiss(6) }
    //     if (clientAllLoading === ApiStatus.rejected && clientApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientApiError.message) }
    //     if (clientByIdLoading === ApiStatus.rejected && clientApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientApiError.message) }
    // }, [clientAllLoading, clientByIdLoading])
    // useEffect(() => {
    //     if (userAllLoading === ApiStatus.pending) { ToastifyLoading(7, 'Loading all user data...') } else { toast.dismiss(7) }
    //     if (userByIdLoading === ApiStatus.pending) { ToastifyLoading(8, 'Loading user data...') } else { toast.dismiss(8) }
    //     if (userAllLoading === ApiStatus.rejected && userApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userApiError.message) }
    //     if (userByIdLoading === ApiStatus.rejected && userApiError) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userApiError.message) }
    // }, [userAllLoading, userByIdLoading])

    const switchDarkTheme = () => {
        const newTheme = theme === ThemeType.light ? ThemeType.dark : ThemeType.light
        setTheme(newTheme)
        localStorage.setItem("theme", JSON.stringify(newTheme))
    }
    const closeSession = () => {
        logout()
        navigate('')
    }
    const formatRouteTitle = (pathname: string) => {
        const formattedTitle = pathname
            .replace(/^\/|\/$/g, '')
            .split('/')
            .map((segment, index, array) => {
                let formattedSegment = segment
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase())

                if (index === array.length - 1 && !isNaN(parseInt(segment))) {
                    formattedSegment = `#${segment}`
                }

                return formattedSegment
            })
            .join(' - ')

        return formattedTitle || "Empty Route"
    }
    const routeIsActive = (route: string) => {
        return location.pathname.startsWith(route)
    }
    const someApiRequestIsLoading =
        bookingAllLoading === ApiStatus.pending ||
        bookingByIdLoading === ApiStatus.pending ||
        roomAllLoading === ApiStatus.pending ||
        roomByIdLoading === ApiStatus.pending ||
        clientAllLoading === ApiStatus.pending ||
        clientByIdLoading === ApiStatus.pending ||
        userAllLoading === ApiStatus.pending ||
        userByIdLoading === ApiStatus.pending
    const someApiRequestHasError =
        (bookingAllLoading === ApiStatus.rejected && bookingApiError) ||
        (bookingByIdLoading === ApiStatus.rejected && bookingApiError) ||
        (roomAllLoading === ApiStatus.rejected && roomApiError) ||
        (roomByIdLoading === ApiStatus.rejected && roomApiError) ||
        (clientAllLoading === ApiStatus.rejected && clientApiError) ||
        (clientByIdLoading === ApiStatus.rejected && clientApiError) ||
        (userAllLoading === ApiStatus.rejected && userApiError) ||
        (userByIdLoading === ApiStatus.rejected && userApiError)


    return !isAuthenticated
        ? <Navigate to="" />
        : <ThemeProvider theme={selectedTheme}>
            <headerStyles.Header isSidebarCollapsed={isSidebarCollapsed} >
                <div>
                    {isSidebarCollapsed
                        ? <headerStyles.IconMenuCollapsed onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                        : <headerStyles.IconMenuNotCollaped onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                    }
                    <headerStyles.TitleH2>{formatRouteTitle(location.pathname)}</headerStyles.TitleH2>
                </div>
                <div>
                    {/* !!! */}
                    {/* <headerStyles.IconMail />
                        <headerStyles.IconBell /> */}
                    {theme === ThemeType.light
                        ? <headerStyles.IconSun onClick={switchDarkTheme} />
                        : <headerStyles.IconMoon onClick={switchDarkTheme} />
                    }
                    <headerStyles.IconLogOut onClick={closeSession} />
                </div>
            </headerStyles.Header>

            <sidebarStyles.SideNavigationBar isSidebarCollapsed={isSidebarCollapsed} >
                <div>
                    <sidebarStyles.IconHotel
                        onClick={() => navigate('/dashboard')}
                        isSidebarCollapsed={isSidebarCollapsed}
                        isCursorPointer={true}
                    />
                    <sidebarStyles.CtnTitle isSidebarCollapsed={isSidebarCollapsed} >
                        <sidebarStyles.TitleH1>travl</sidebarStyles.TitleH1>
                        <sidebarStyles.TitleText>Hotel Admin Dashboard</sidebarStyles.TitleText>
                    </sidebarStyles.CtnTitle>
                </div>

                <div>
                    <sidebarStyles.CtnNavOption
                        onClick={() => navigate('/dashboard')}
                        routeIsActive={routeIsActive('/dashboard')}
                        isSidebarCollapsed={isSidebarCollapsed}>
                        <sidebarStyles.IconDashboard />
                        <sidebarStyles.NavOptionText isSidebarCollapsed={isSidebarCollapsed} >
                            Dashboard
                        </sidebarStyles.NavOptionText>
                    </sidebarStyles.CtnNavOption>
                    <sidebarStyles.CtnNavOption
                        data-cy="nav-ctn-bookings"
                        onClick={() => navigate('/bookings')}
                        routeIsActive={routeIsActive('/bookings')}
                        isSidebarCollapsed={isSidebarCollapsed}>
                        <sidebarStyles.IconBooking />
                        <sidebarStyles.NavOptionText isSidebarCollapsed={isSidebarCollapsed} >
                            Bookings
                        </sidebarStyles.NavOptionText>
                    </sidebarStyles.CtnNavOption>
                    <sidebarStyles.CtnNavOption
                        data-cy="nav-ctn-rooms"
                        onClick={() => navigate('/rooms')}
                        routeIsActive={routeIsActive('/rooms')}
                        isSidebarCollapsed={isSidebarCollapsed}>
                        <sidebarStyles.IconRooms />
                        <sidebarStyles.NavOptionText isSidebarCollapsed={isSidebarCollapsed} >
                            Rooms
                        </sidebarStyles.NavOptionText>
                    </sidebarStyles.CtnNavOption>
                    <sidebarStyles.CtnNavOption
                        onClick={() => navigate('/clients')}
                        routeIsActive={routeIsActive('/clients')}
                        isSidebarCollapsed={isSidebarCollapsed}>
                        <sidebarStyles.IconClient />
                        <sidebarStyles.NavOptionText isSidebarCollapsed={isSidebarCollapsed} >
                            Clients
                        </sidebarStyles.NavOptionText>
                    </sidebarStyles.CtnNavOption>
                    <sidebarStyles.CtnNavOption
                        onClick={() => navigate('/users')}
                        routeIsActive={routeIsActive('/users')}
                        isSidebarCollapsed={isSidebarCollapsed}>
                        <sidebarStyles.IconUsers />
                        <sidebarStyles.NavOptionText isSidebarCollapsed={isSidebarCollapsed} >
                            Users
                        </sidebarStyles.NavOptionText>
                    </sidebarStyles.CtnNavOption>
                </div>

                <sidebarStyles.CtnUser isSidebarCollapsed={isSidebarCollapsed} >
                    <sidebarStyles.ImgProfile src={`${userById.photo}`}></sidebarStyles.ImgProfile>
                    <sidebarStyles.TitleH4>{userById.full_name}</sidebarStyles.TitleH4>
                    <sidebarStyles.TitleH5>{userById.email}</sidebarStyles.TitleH5>
                    {/* !!! SI EL USUARIO SE QUIERE EDITAR A SI MISMO (REPLANTEAR CONCEPTO): */}
                    {/* <sidebarStyles.ButtonEdit onClick={() => { navigateToUserUpdate(userById._id) }}>Edit</sidebarStyles.ButtonEdit> */}
                </sidebarStyles.CtnUser>

                <sidebarStyles.CtnCredits isSidebarCollapsed={isSidebarCollapsed} >
                    <sidebarStyles.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sidebarStyles.TitleMayorCreditH5>
                    <sidebarStyles.TitleMinorCreditH6>2025 All Rights Reserved</sidebarStyles.TitleMinorCreditH6>
                </sidebarStyles.CtnCredits>
            </sidebarStyles.SideNavigationBar>

            <layoutStyles.Main isSidebarCollapsed={isSidebarCollapsed}>
                {someApiRequestIsLoading || someApiRequestHasError
                    ? <ToastContainer />
                    : <Outlet />
                }
            </layoutStyles.Main>
        </ThemeProvider>

}