
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom";

import * as hd from "./header.js"
import * as sb from "./sidebarMenu.js"


export const Layout = () => {

    const [sidebarDisplayed, setSidebarDisplayed] = useState(true);

    const displaySidebarMenu = () => {
        setSidebarDisplayed(!sidebarDisplayed)
    }

    const navigate = useNavigate()
    const closeSession = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('')
    }

    return (

        <div style={{ display: 'flex' }}>

            {/* SIDE BAR */}
            <sb.AsideSideNavigationBar display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    <sb.IconHotel display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} />
                    <sb.DivCtnTitle display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        <sb.TitleH1>travl</sb.TitleH1>
                        <sb.PTitleText>Hotel Admin Dashboard</sb.PTitleText>
                    </sb.DivCtnTitle>
                </div>

                <div>
                    <a href="/dashboard">
                        <sb.DivCtnNavOption>
                            <sb.IconDashboard />
                            <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                                Dashboard
                            </sb.PNavOptionText>
                        </sb.DivCtnNavOption>
                    </a>
                    <a href="/bookings">
                        <sb.DivCtnNavOption>
                            <sb.IconBooking />
                            <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                                Bookings
                            </sb.PNavOptionText>
                        </sb.DivCtnNavOption>
                    </a>
                    <a href="/roomList">
                        <sb.DivCtnNavOption>
                            <sb.IconRooms />
                            <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                                Rooms
                            </sb.PNavOptionText>
                        </sb.DivCtnNavOption>
                    </a>
                    <a href="/contact">
                        <sb.DivCtnNavOption>
                            <sb.IconContact />
                            <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                                Contact
                            </sb.PNavOptionText>
                        </sb.DivCtnNavOption>
                    </a>
                    <a href="/users">
                        <sb.DivCtnNavOption>
                            <sb.IconUsers />
                            <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                                Users
                            </sb.PNavOptionText>
                        </sb.DivCtnNavOption>
                    </a>
                </div>

                <sb.DivCtnUser display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                    <sb.ImgProfile src="src\common\media\img\HC.png" />
                    <sb.TitleH4>Henry Cavill</sb.TitleH4>
                    <sb.TitleH5>HenryCavill@gmail.com</sb.TitleH5>
                    <sb.ButtonContactUs>Contact Us</sb.ButtonContactUs>
                </sb.DivCtnUser>

                <sb.DivCtnCredits display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                    <sb.TitleMayorCreditH5>Travl Hotel Admin Dashboard</sb.TitleMayorCreditH5>
                    <sb.TitleMinorCreditH6>2025 All Rights Reserved</sb.TitleMinorCreditH6>
                </sb.DivCtnCredits>
            </sb.AsideSideNavigationBar>

            {/* HEADER */}
            <div style={{ width: '100%' }}>
                <hd.Header>
                    <div>
                        {sidebarDisplayed ?
                            <hd.IconMenuCollapsed onClick={displaySidebarMenu} /> :
                            <hd.IconMenuNotCollaped onClick={displaySidebarMenu} />
                        }
                        <hd.TitleH2>Dashboard</hd.TitleH2>
                    </div>
                    <div>
                        <hd.IconMail />
                        <hd.IconBell />
                        <hd.IconLogOut onClick={closeSession} />
                    </div>
                </hd.Header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>

    )
}