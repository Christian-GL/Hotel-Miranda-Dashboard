
import { useEffect, useState, useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as layoutStyles from "./layoutStyles"
import * as headerStyles from "./headerStyles"
import * as sidebarStyles from "./sidebarMenuStyles"
import { ThemeProvider } from 'styled-components'
import { Theme } from "../../context/darkModeContext"
import { themeLight, themeDark } from "../../styles/themes"
import { ToastContainer, toast } from 'react-toastify'
import { ToastifyLoadingData } from "../toastify/loadingDataPopup/toastifyLoadingData"
import { customPopupMessage } from '../../utils/customPopupMessage'
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { AppDispatch } from "../../redux/store"
import { useLoginOptionsContext } from '../../../signIn/features/loginProvider'
import { getBookingAllStatus, getBookingIdStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { getRoomAllStatus, getRoomIdStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { getClientAllStatus, getClientIdStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { getUserAllStatus, getUserIdStatus, getUserIdData, getUserErrorMessage } from "../../../user/features/userSlice"
import { UserFetchByIDThunk } from "../../../user/features/thunks/userFetchByIDThunk"
import { ApiStatus } from "../../enums/ApiStatus"


export const Layout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const { theme, setTheme } = useContext(Theme)
    const selectedTheme = theme === 'light' ? themeLight : themeDark
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true)
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
        if (!isAuthenticated()) {
            navigate('/')
        }
        const savedTheme = localStorage.getItem("theme")
        savedTheme === null ?
            setTheme('light') :
            setTheme(JSON.parse(savedTheme))
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
        if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
        if (bookingByIdLoading === ApiStatus.pending) { ToastifyLoadingData(2, 'Loading booking by ID data...') } else { toast.dismiss(2) }
        if (bookingByIdLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }

        if (roomAllLoading === ApiStatus.pending) { ToastifyLoadingData(3, 'Loading all room data...') } else { toast.dismiss(3) }
        if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
        if (roomByIdLoading === ApiStatus.pending) { ToastifyLoadingData(4, 'Loading room by ID data...') } else { toast.dismiss(4) }
        if (roomByIdLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }

        if (clientAllLoading === ApiStatus.pending) { ToastifyLoadingData(5, 'Loading all client data...') } else { toast.dismiss(5) }
        if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
        if (clientByIdLoading === ApiStatus.pending) { ToastifyLoadingData(6, 'Loading client by ID data...') } else { toast.dismiss(6) }
        if (clientByIdLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }

        if (userAllLoading === ApiStatus.pending) { ToastifyLoadingData(7, 'Loading all user data...') } else { toast.dismiss(7) }
        if (userAllLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
        if (userByIdLoading === ApiStatus.pending) { ToastifyLoadingData(8, 'Loading user by ID data...') } else { toast.dismiss(8) }
        if (userByIdLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
    }, [bookingAllLoading, bookingByIdLoading, roomAllLoading, roomByIdLoading, clientAllLoading, clientByIdLoading, userAllLoading, userByIdLoading])

    const switchDarkTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem("theme", JSON.stringify(newTheme))
    }
    const closeSession = () => {
        logout()
        navigate('')
    }
    const displaySidebarMenu = () => {
        setSidebarCollapsed(!sidebarCollapsed)
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
    // const navigateToUserUpdate = (id: string) => navigate(`users/user-update/${id}`)


    return !isAuthenticated
        ? <Navigate to="" />
        : <ThemeProvider theme={selectedTheme}>
            <headerStyles.Header display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    {sidebarCollapsed ?
                        <headerStyles.IconMenuCollapsed onClick={displaySidebarMenu} /> :
                        <headerStyles.IconMenuNotCollaped onClick={displaySidebarMenu} />
                    }
                    <headerStyles.TitleH2 >{formatRouteTitle(location.pathname)}</headerStyles.TitleH2>
                </div>
                <div>
                    {/* !!! */}
                    {/* <headerStyles.IconMail />
                        <headerStyles.IconBell /> */}
                    {
                        theme === 'light' ?
                            <headerStyles.Sun onClick={switchDarkTheme} /> :
                            <headerStyles.Moon onClick={switchDarkTheme} />
                    }
                    <headerStyles.IconLogOut onClick={closeSession} />
                </div>
            </headerStyles.Header>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <sidebarStyles.AsideSideNavigationBar display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    <sidebarStyles.IconHotel
                        onClick={() => navigate('/dashboard')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}
                        isCursorPointer={true}
                    />
                    <sidebarStyles.DivCtnTitle display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                        <sidebarStyles.TitleH1>travl</sidebarStyles.TitleH1>
                        <sidebarStyles.PTitleText>Hotel Admin Dashboard</sidebarStyles.PTitleText>
                    </sidebarStyles.DivCtnTitle>
                </div>

                <div>
                    <sidebarStyles.DivCtnNavOption
                        onClick={() => navigate('/dashboard')}
                        routeIsActive={routeIsActive('/dashboard')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarStyles.IconDashboard />
                        <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Dashboard
                        </sidebarStyles.PNavOptionText>
                    </sidebarStyles.DivCtnNavOption>
                    <sidebarStyles.DivCtnNavOption
                        data-cy="nav-ctn-bookings"
                        onClick={() => navigate('/bookings')}
                        routeIsActive={routeIsActive('/bookings')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarStyles.IconBooking />
                        <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Bookings
                        </sidebarStyles.PNavOptionText>
                    </sidebarStyles.DivCtnNavOption>
                    <sidebarStyles.DivCtnNavOption
                        data-cy="nav-ctn-rooms"
                        onClick={() => navigate('/rooms')}
                        routeIsActive={routeIsActive('/rooms')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarStyles.IconRooms />
                        <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Rooms
                        </sidebarStyles.PNavOptionText>
                    </sidebarStyles.DivCtnNavOption>
                    <sidebarStyles.DivCtnNavOption
                        onClick={() => navigate('/clients')}
                        routeIsActive={routeIsActive('/clients')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarStyles.IconClient />
                        <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Clients
                        </sidebarStyles.PNavOptionText>
                    </sidebarStyles.DivCtnNavOption>
                    <sidebarStyles.DivCtnNavOption
                        onClick={() => navigate('/users')}
                        routeIsActive={routeIsActive('/users')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarStyles.IconUsers />
                        <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Users
                        </sidebarStyles.PNavOptionText>
                    </sidebarStyles.DivCtnNavOption>
                </div>

                <sidebarStyles.DivCtnUser display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarStyles.ImgProfile src={`${userById.photo}`}></sidebarStyles.ImgProfile>
                    <sidebarStyles.TitleH4>{userById.full_name}</sidebarStyles.TitleH4>
                    <sidebarStyles.TitleH5>{userById.email}</sidebarStyles.TitleH5>
                    {/* !!! SI EL USUARIO SE QUIERE EDITAR A SI MISMO (REPLANTEAR CONCEPTO): */}
                    {/* <sidebarStyles.ButtonEdit onClick={() => { navigateToUserUpdate(userById._id) }}>Edit</sidebarStyles.ButtonEdit> */}
                </sidebarStyles.DivCtnUser>

                <sidebarStyles.DivCtnCredits display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarStyles.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sidebarStyles.TitleMayorCreditH5>
                    <sidebarStyles.TitleMinorCreditH6>2025 All Rights Reserved</sidebarStyles.TitleMinorCreditH6>
                </sidebarStyles.DivCtnCredits>
            </sidebarStyles.AsideSideNavigationBar>

            <layoutStyles.Main display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                {
                    bookingAllLoading === ApiStatus.pending
                        || bookingByIdLoading === ApiStatus.pending
                        || roomAllLoading === ApiStatus.pending
                        || roomByIdLoading === ApiStatus.pending
                        || clientAllLoading === ApiStatus.pending
                        || clientByIdLoading === ApiStatus.pending
                        || userAllLoading === ApiStatus.pending
                        || userByIdLoading === ApiStatus.pending
                        ? <ToastContainer />
                        : <Outlet />
                }
            </layoutStyles.Main>
        </ThemeProvider>

}