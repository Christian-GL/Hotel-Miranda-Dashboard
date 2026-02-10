
import { useEffect, useState, useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ToastContainer, toast } from 'react-toastify'

import * as headerStyles from "./headerStyles"
import * as sidebarStyles from "./sidebarMenuStyles"
import * as layoutStyles from "./layoutStyles"
import { ThemeProvider } from 'styled-components'
import { Theme } from "../../context/darkModeContext"
import { themeLight, themeDark } from "../../styles/themes"
import { ToastifyLoadingData } from "../toastify/loadingDataPopup/toastifyLoadingData"
import { customPopupMessage } from '../../utils/customPopupMessage'
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { AppDispatch } from "../../redux/store"
import { useLoginOptionsContext } from '../../../signIn/features/loginProvider'
import { ApiStatus } from "../../enums/ApiStatus"
import { getBookingAllStatus, getBookingIdStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { getRoomAllStatus, getRoomIdStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { getClientAllStatus, getClientIdStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { getUserAllStatus, getUserIdStatus, getUserIdData, getUserErrorMessage } from "../../../user/features/userSlice"
import { UserFetchByIDThunk } from "../../../user/features/thunks/userFetchByIDThunk"


export const Layout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const location = useLocation()
    const { theme, setTheme } = useContext(Theme)
    const selectedTheme = theme === 'light' ? themeLight : themeDark
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomByIdLoading: ApiStatus = useSelector(getRoomIdStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const clientByIdLoading: ApiStatus = useSelector(getClientIdStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const userById = useSelector(getUserIdData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const userByIdLoading: ApiStatus = useSelector(getUserIdStatus)
    const userErrorMessage = useSelector(getUserErrorMessage)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })
    const loggedUserID = localStorage.getItem('loggedUserID') || null

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/') }
        const savedTheme = localStorage.getItem("theme")
        savedTheme === null
            ? setTheme('light')
            : setTheme(JSON.parse(savedTheme))
    }, [navigate, isAuthenticated, theme])
    useEffect(() => {
        if (loggedUserID && userByIdLoading === ApiStatus.idle) { dispatch(UserFetchByIDThunk(loggedUserID)) }
        else if (userByIdLoading === ApiStatus.fulfilled) {
            if (loggedUserID && loggedUserID !== userById._id && !routeIsActive('/users')) {
                dispatch(UserFetchByIDThunk(loggedUserID))
            }
        }
        else if (userByIdLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
    }, [userByIdLoading, userById, loggedUserID])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.pending) { ToastifyLoadingData(1, 'Loading all booking data...') } else { toast.dismiss(1) }
        if (bookingByIdLoading === ApiStatus.pending) { ToastifyLoadingData(2, 'Loading booking data...') } else { toast.dismiss(2) }
        if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
        if (bookingByIdLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingAllLoading, bookingByIdLoading])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.pending) { ToastifyLoadingData(3, 'Loading all room data...') } else { toast.dismiss(3) }
        if (roomByIdLoading === ApiStatus.pending) { ToastifyLoadingData(4, 'Loading room data...') } else { toast.dismiss(4) }
        if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
        if (roomByIdLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    }, [roomAllLoading, roomByIdLoading])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.pending) { ToastifyLoadingData(5, 'Loading all client data...') } else { toast.dismiss(5) }
        if (clientByIdLoading === ApiStatus.pending) { ToastifyLoadingData(6, 'Loading client data...') } else { toast.dismiss(6) }
        if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
        if (clientByIdLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
    }, [clientAllLoading, clientByIdLoading])
    useEffect(() => {
        if (userAllLoading === ApiStatus.pending) { ToastifyLoadingData(7, 'Loading all user data...') } else { toast.dismiss(7) }
        if (userByIdLoading === ApiStatus.pending) { ToastifyLoadingData(8, 'Loading user data...') } else { toast.dismiss(8) }
        if (userAllLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
        if (userByIdLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
    }, [userAllLoading, userByIdLoading])

    const switchDarkTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
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
        (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) ||
        (bookingByIdLoading === ApiStatus.rejected && bookingErrorMessage) ||
        (roomAllLoading === ApiStatus.rejected && roomErrorMessage) ||
        (roomByIdLoading === ApiStatus.rejected && roomErrorMessage) ||
        (clientAllLoading === ApiStatus.rejected && clientErrorMessage) ||
        (clientByIdLoading === ApiStatus.rejected && clientErrorMessage) ||
        (userAllLoading === ApiStatus.rejected && userErrorMessage) ||
        (userByIdLoading === ApiStatus.rejected && userErrorMessage)


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
                    {theme === 'light'
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
                {someApiRequestIsLoading
                    ? <ToastContainer />
                    : someApiRequestHasError
                        ? <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />
                        : <Outlet />
                }
            </layoutStyles.Main>
        </ThemeProvider>

}