
import React from "react"
import { useEffect, useState, useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import HC from '../../../assets/img/HC.png'
import * as layoutStyles from "./layoutStyles.ts"
import * as headerStyles from "./headerStyles.ts"
import * as sidebarStyles from "./sidebarMenuStyles.ts"
import { ThemeProvider } from 'styled-components'
import { Theme } from "../../context/darkModeContext.tsx"
import { themeLight, themeDark } from "../../styles/themeColors.ts"
import { ToastContainer, toast } from 'react-toastify'
import { ToastifyLoadingData } from "../toastify/loadingDataPopup/toastifyLoadingData.tsx"
import { useLoginOptionsContext } from "../signIn/features/loginProvider.tsx"
import { getBookingAllStatus, getBookingIdStatus } from "../../../booking/features/bookingSlice.ts"
import { getRoomAllStatus, getRoomIdStatus } from "../../../room/features/roomSlice.ts"
import { getContactAllStatus, getContactIdStatus } from "../../../contact/features/contactSlice.ts"
import { getUserAllStatus, getUserIdStatus } from "../../../user/features/userSlice.ts"
import { ApiStatus } from "../../enums/ApiStatus.ts"


export const Layout = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { theme, setTheme } = useContext(Theme)
    const selectedTheme = theme === 'light' ? themeLight : themeDark
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomByIdLoading: ApiStatus = useSelector(getRoomIdStatus)
    const contactAllLoading: ApiStatus = useSelector(getContactAllStatus)
    const contactByIdLoading: ApiStatus = useSelector(getContactIdStatus)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const userByIdLoading: ApiStatus = useSelector(getUserIdStatus)

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
        if (bookingAllLoading === ApiStatus.pending) { ToastifyLoadingData(1, 'Loading all booking data...') } else { toast.dismiss(1) }
        if (bookingByIdLoading === ApiStatus.pending) { ToastifyLoadingData(2, 'Loading booking by ID data...') } else { toast.dismiss(2) }
        if (roomAllLoading === ApiStatus.pending) { ToastifyLoadingData(3, 'Loading all room data...') } else { toast.dismiss(3) }
        if (roomByIdLoading === ApiStatus.pending) { ToastifyLoadingData(4, 'Loading room by ID data...') } else { toast.dismiss(4) }
        if (contactAllLoading === ApiStatus.pending) { ToastifyLoadingData(5, 'Loading all contact data...') } else { toast.dismiss(5) }
        if (contactByIdLoading === ApiStatus.pending) { ToastifyLoadingData(6, 'Loading contact by ID data...') } else { toast.dismiss(6) }
        if (userAllLoading === ApiStatus.pending) { ToastifyLoadingData(7, 'loading all user data...') } else { toast.dismiss(7) }
        if (userByIdLoading === ApiStatus.pending) { ToastifyLoadingData(8, 'loading user by ID data...') } else { toast.dismiss(8) }
    }, [bookingAllLoading, bookingByIdLoading, roomAllLoading, roomByIdLoading,
        contactAllLoading, contactByIdLoading, userAllLoading, userByIdLoading])

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


    return !isAuthenticated ?
        <Navigate to="" /> :
        (<>
            <ThemeProvider theme={selectedTheme}>
                <headerStyles.Header display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <div>
                        {sidebarCollapsed ?
                            <headerStyles.IconMenuCollapsed onClick={displaySidebarMenu} /> :
                            <headerStyles.IconMenuNotCollaped onClick={displaySidebarMenu} />
                        }
                        <headerStyles.TitleH2 >{formatRouteTitle(location.pathname)}</headerStyles.TitleH2>
                    </div>
                    <div>
                        <headerStyles.IconMail />
                        <headerStyles.IconBell />
                        {
                            theme === 'light' ?
                                <headerStyles.Sun onClick={switchDarkTheme} /> :
                                <headerStyles.Moon onClick={switchDarkTheme} />
                        }
                        <headerStyles.IconLogOut onClick={closeSession} />
                    </div>
                </headerStyles.Header>

                <sidebarStyles.AsideSideNavigationBar display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <div>
                        <sidebarStyles.IconHotel onClick={() => navigate('/dashboard')} display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} />
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
                            onClick={() => navigate('/contacts')}
                            routeIsActive={routeIsActive('/contacts')}
                            display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                            <sidebarStyles.IconContact />
                            <sidebarStyles.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                                Contact
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
                        <sidebarStyles.ImgProfile src={HC} />
                        <sidebarStyles.TitleH4>Henry Cavill</sidebarStyles.TitleH4>
                        <sidebarStyles.TitleH5>HenryCavill@gmail.com</sidebarStyles.TitleH5>
                        <sidebarStyles.ButtonEdit>Edit</sidebarStyles.ButtonEdit>
                    </sidebarStyles.DivCtnUser>

                    <sidebarStyles.DivCtnCredits display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                        <sidebarStyles.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sidebarStyles.TitleMayorCreditH5>
                        <sidebarStyles.TitleMinorCreditH6>2025 All Rights Reserved</sidebarStyles.TitleMinorCreditH6>
                    </sidebarStyles.DivCtnCredits>
                </sidebarStyles.AsideSideNavigationBar>

                <layoutStyles.Main display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                    {
                        bookingAllLoading === ApiStatus.pending || bookingByIdLoading === ApiStatus.pending ||
                            roomAllLoading === ApiStatus.pending || roomByIdLoading === ApiStatus.pending ||
                            contactAllLoading === ApiStatus.pending || contactByIdLoading === ApiStatus.pending ||
                            userAllLoading === ApiStatus.pending || userByIdLoading === ApiStatus.pending ?
                            <ToastContainer /> :
                            <Outlet />
                    }
                </layoutStyles.Main>
            </ThemeProvider>
        </>)
}