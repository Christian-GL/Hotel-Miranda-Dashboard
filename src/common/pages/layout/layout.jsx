
import { useState } from "react"
import { Outlet } from "react-router-dom"

import * as hd from "../../styles/header.js"
import * as sb from "../../styles/sidebarMenu.js"


export const Layout = () => {

    const [sidebarDisplayed, setSidebarDisplayed] = useState(true);

    const displaySidebarMenu = () => {
        setSidebarDisplayed(!sidebarDisplayed)
    }

    return (<>

        <div style={{ display: 'flex' }}>
            <sb.AsideSideNavigationBar display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                <div>
                    <sb.IconHotel display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} />
                    <sb.DivCtnTitle display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        <sb.TitleH1>travl</sb.TitleH1>
                        <sb.PTitleText>Hotel Admin Dashboard</sb.PTitleText>
                    </sb.DivCtnTitle>
                </div>

                <div>
                    <sb.DivCtnNavOption>
                        <sb.IconDashboard />
                        <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Dashboard
                        </sb.PNavOptionText>
                    </sb.DivCtnNavOption>
                    <sb.DivCtnNavOption>
                        <sb.IconBooking />
                        <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Bookings
                        </sb.PNavOptionText>
                    </sb.DivCtnNavOption>
                    <sb.DivCtnNavOption>
                        <sb.IconRooms />
                        <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Rooms
                        </sb.PNavOptionText>
                    </sb.DivCtnNavOption>
                    <sb.DivCtnNavOption>
                        <sb.IconContact />
                        <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Contact
                        </sb.PNavOptionText>
                    </sb.DivCtnNavOption>
                    <sb.DivCtnNavOption>
                        <sb.IconUsers />
                        <sb.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                            Users
                        </sb.PNavOptionText>
                    </sb.DivCtnNavOption>
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
                        <hd.IconLogOut />
                    </div>
                </hd.Header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>

    </>)
}