
import React from "react"
import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import HC from '../../../assets/img/HC.png'
import * as layoutJS from "./layoutStyles.ts"
import * as headerJS from "./headerStyles.ts"
import * as sidebarJS from "./sidebarMenuStyles.ts"
import { useLoginOptionsContext } from "../signIn/features/loginProvider.tsx"


export const Layout = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true)

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/')
        }
    }, [navigate, isAuthenticated])

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

    if (!isAuthenticated) {
        return <Navigate to="" />
    }
    else
        return (<>

            <headerJS.Header display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                <div>
                    {sidebarCollapsed ?
                        <headerJS.IconMenuCollapsed onClick={displaySidebarMenu} /> :
                        <headerJS.IconMenuNotCollaped onClick={displaySidebarMenu} />
                    }
                    <headerJS.TitleH2>{formatRouteTitle(location.pathname)}</headerJS.TitleH2>
                </div>
                <div>
                    <headerJS.IconMail />
                    <headerJS.IconBell />
                    <headerJS.IconLogOut onClick={closeSession} />
                </div>
            </headerJS.Header>

            <sidebarJS.AsideSideNavigationBar display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    <sidebarJS.IconHotel onClick={() => navigate('/dashboard')} display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} />
                    <sidebarJS.DivCtnTitle display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                        <sidebarJS.TitleH1>travl</sidebarJS.TitleH1>
                        <sidebarJS.PTitleText>Hotel Admin Dashboard</sidebarJS.PTitleText>
                    </sidebarJS.DivCtnTitle>
                </div>

                <div>
                    <sidebarJS.DivCtnNavOption
                        onClick={() => navigate('/dashboard')}
                        routeIsActive={routeIsActive('/dashboard')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconDashboard />
                        <sidebarJS.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Dashboard
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    <sidebarJS.DivCtnNavOption
                        data-cy="nav-ctn-bookings"
                        onClick={() => navigate('/bookings')}
                        routeIsActive={routeIsActive('/bookings')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconBooking />
                        <sidebarJS.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Bookings
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    <sidebarJS.DivCtnNavOption
                        data-cy="nav-ctn-rooms"
                        onClick={() => navigate('/rooms')}
                        routeIsActive={routeIsActive('/rooms')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconRooms />
                        <sidebarJS.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Rooms
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    <sidebarJS.DivCtnNavOption
                        onClick={() => navigate('/contacts')}
                        routeIsActive={routeIsActive('/contacts')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconContact />
                        <sidebarJS.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Contact
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    <sidebarJS.DivCtnNavOption
                        onClick={() => navigate('/users')}
                        routeIsActive={routeIsActive('/users')}
                        display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconUsers />
                        <sidebarJS.PNavOptionText display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                            Users
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                </div>

                <sidebarJS.DivCtnUser display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarJS.ImgProfile src={HC} />
                    <sidebarJS.TitleH4>Henry Cavill</sidebarJS.TitleH4>
                    <sidebarJS.TitleH5>HenryCavill@gmail.com</sidebarJS.TitleH5>
                    <sidebarJS.ButtonEdit>Editar</sidebarJS.ButtonEdit>
                </sidebarJS.DivCtnUser>

                <sidebarJS.DivCtnCredits display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarJS.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sidebarJS.TitleMayorCreditH5>
                    <sidebarJS.TitleMinorCreditH6>2025 All Rights Reserved</sidebarJS.TitleMinorCreditH6>
                </sidebarJS.DivCtnCredits>
            </sidebarJS.AsideSideNavigationBar>

            <layoutJS.Main display={`${sidebarCollapsed ? 'collapsed' : 'notCollapsed'}`}>
                <Outlet />
            </layoutJS.Main>

        </>)
}