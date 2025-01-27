
import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import HC from '../../../assets/img/HC.png'
import * as layoutJS from "./layout.js"
import * as headerJS from "./header.js"
import * as sidebarJS from "./sidebarMenu.js"
import { useLoginOptionsContext } from "../signUp/features/loginProvider.jsx"


export const Layout = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { logout, isAuthenticated } = useLoginOptionsContext()
    const [sidebarDisplayed, setSidebarDisplayed] = useState(true)

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarDisplayed')
        if (savedState !== null) {
            setSidebarDisplayed(JSON.parse(savedState))
        }
    }, [])

    const closeSession = () => {
        logout()
        navigate('')
    }
    const displaySidebarMenu = () => {
        setSidebarDisplayed((prevState) => {
            const newState = !prevState
            localStorage.setItem('sidebarDisplayed', JSON.stringify(newState))
            return newState
        })
    }
    const formatRouteTitle = (pathname) => {
        const formattedTitle = pathname
            .replace(/^\/|\/$/g, '')
            .split('/')
            .map((segment, index, array) => {
                let formattedSegment = segment
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase())

                if (index === array.length - 1 && !isNaN(segment)) {
                    formattedSegment = `#${segment}`
                }

                return formattedSegment
            })
            .join(' - ')

        return formattedTitle || "Empty Route"
    }
    const routeIsActive = (route) => {
        return location.pathname.startsWith(route)
    }

    if (!isAuthenticated) {
        return <Navigate to="" />
    }
    else
        return (<>

            <headerJS.Header display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                <div>
                    {sidebarDisplayed ?
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

            <sidebarJS.AsideSideNavigationBar display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    <sidebarJS.IconHotel onClick={() => navigate('/dashboard')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} />
                    <sidebarJS.DivCtnTitle display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        <sidebarJS.TitleH1>travl</sidebarJS.TitleH1>
                        <sidebarJS.PTitleText>Hotel Admin Dashboard</sidebarJS.PTitleText>
                    </sidebarJS.DivCtnTitle>
                </div>

                <div>
                    {/* <a href="/dashboard"> */}
                    <sidebarJS.DivCtnNavOption onClick={() => navigate('/dashboard')} routeIsActive={routeIsActive('/dashboard')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconDashboard />
                        <sidebarJS.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Dashboard
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    {/* </a> */}
                    {/* <a href="/bookings"> */}
                    <sidebarJS.DivCtnNavOption onClick={() => navigate('/bookings')} routeIsActive={routeIsActive('/bookings')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconBooking />
                        <sidebarJS.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Bookings
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    {/* </a> */}
                    {/* <a href="/rooms"> */}
                    <sidebarJS.DivCtnNavOption onClick={() => navigate('/rooms')} routeIsActive={routeIsActive('/rooms')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconRooms />
                        <sidebarJS.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Rooms
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    {/* </a> */}
                    {/* <a href="/contacts"> */}
                    <sidebarJS.DivCtnNavOption onClick={() => navigate('/contacts')} routeIsActive={routeIsActive('/contacts')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconContact />
                        <sidebarJS.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Contact
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    {/* </a> */}
                    {/* <a href="/users"> */}
                    <sidebarJS.DivCtnNavOption onClick={() => navigate('/users')} routeIsActive={routeIsActive('/users')} display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                        <sidebarJS.IconUsers />
                        <sidebarJS.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Users
                        </sidebarJS.PNavOptionText>
                    </sidebarJS.DivCtnNavOption>
                    {/* </a> */}
                </div>

                <sidebarJS.DivCtnUser display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarJS.ImgProfile src={HC} />
                    <sidebarJS.TitleH4>Henry Cavill</sidebarJS.TitleH4>
                    <sidebarJS.TitleH5>HenryCavill@gmail.com</sidebarJS.TitleH5>
                    <sidebarJS.ButtonContactUs>Contact Us</sidebarJS.ButtonContactUs>
                </sidebarJS.DivCtnUser>

                <sidebarJS.DivCtnCredits display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                    <sidebarJS.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sidebarJS.TitleMayorCreditH5>
                    <sidebarJS.TitleMinorCreditH6>2025 All Rights Reserved</sidebarJS.TitleMinorCreditH6>
                </sidebarJS.DivCtnCredits>
            </sidebarJS.AsideSideNavigationBar>

            <layoutJS.Main display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`}>
                <Outlet />
            </layoutJS.Main>

        </>)
}