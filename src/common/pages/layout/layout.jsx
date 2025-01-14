
import { useState } from "react"
import { Outlet } from "react-router-dom"

import * as ly from "../../styles/layout.js"


export const Layout = () => {

    const [sidebarDisplayed, setSidebarDisplayed] = useState(true);

    const displaySidebarMenu = () => {
        setSidebarDisplayed(!sidebarDisplayed)
    }

    return (<>

        <ly.Header display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >

            <div>
                <ly.IconMenu onClick={displaySidebarMenu} />
                <ly.TitleH2>Dashboard</ly.TitleH2>
            </div>
            <div>
                <ly.IconMail></ly.IconMail>
                <ly.IconBell></ly.IconBell>
                <ly.IconLogOut></ly.IconLogOut>
            </div>
        </ly.Header>


        <ly.AsideSideNavigationBar display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
            <div>
                <ly.IconHotel display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} ></ly.IconHotel>
                <ly.DivCtnTitle display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                    <ly.TitleH1>travl</ly.TitleH1>
                    <ly.PTitleText>Hotel Admin Dashboard</ly.PTitleText>
                </ly.DivCtnTitle>
            </div>

            <div>
                <ly.DivCtnNavOption>
                    <ly.IconDashboard></ly.IconDashboard>
                    <ly.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        Dashboard
                    </ly.PNavOptionText>
                </ly.DivCtnNavOption>
                <ly.DivCtnNavOption>
                    <ly.IconBooking></ly.IconBooking>
                    <ly.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        Bookings
                    </ly.PNavOptionText>
                </ly.DivCtnNavOption>
                <ly.DivCtnNavOption>
                    <ly.IconRooms></ly.IconRooms>
                    <ly.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        Rooms
                    </ly.PNavOptionText>
                </ly.DivCtnNavOption>
                <ly.DivCtnNavOption>
                    <ly.IconContact></ly.IconContact>
                    <ly.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        Contact
                    </ly.PNavOptionText>
                </ly.DivCtnNavOption>
                <ly.DivCtnNavOption>
                    <ly.IconUsers></ly.IconUsers>
                    <ly.PNavOptionText display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                        Users
                    </ly.PNavOptionText>
                </ly.DivCtnNavOption>
            </div>

            <ly.DivCtnUser display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                <ly.ImgProfile src="src\common\media\img\HC.png" ></ly.ImgProfile>
                <ly.TitleH4>Henry Cavill</ly.TitleH4>
                <ly.TitleH5>HenryCavill@gmail.com</ly.TitleH5>
                <ly.ButtonContactUs>Contact Us</ly.ButtonContactUs>
            </ly.DivCtnUser>

            <ly.DivCtnCredits display={`${sidebarDisplayed ? 'collapsed' : 'notCollapsed'}`} >
                <ly.TitleMayorCreditH5>Travl Hotel Admin Dashboard</ly.TitleMayorCreditH5>
                <ly.TitleMinorCreditH6>2025 All Rights Reserved</ly.TitleMinorCreditH6>
            </ly.DivCtnCredits>
        </ly.AsideSideNavigationBar>

        <main>
            <Outlet />
        </main>

    </>)
}