
import { styled } from 'styled-components'

import { FaRegCalendarAlt } from "react-icons/fa"
import { RiHotelFill } from "react-icons/ri"
import { LuLayoutDashboard } from "react-icons/lu"
import { MdOutlineBedroomParent } from "react-icons/md"
import { FaUserGear } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"

import * as globalConstStyles from '../../styles/globalConstStyles'


export const SideNavigationBar = styled.aside<{ isSidebarCollapsed?: boolean }>`
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: ${props => props.isSidebarCollapsed ? 'center' : 'left'};
    justify-content: ${props => props.isSidebarCollapsed ? 'flex-start' : 'space-between'};
    padding: ${props => props.isSidebarCollapsed ? '1em' : '1em 2.5em'};
    width: ${props => props.isSidebarCollapsed ? `${globalConstStyles.widthSidebarMenuCollapsed}` : `${globalConstStyles.widthSidebarMenuNotCollapsed}`};
    height: 100vh;
    text-align: left;
    transition: ${globalConstStyles.transitionSidebarMenu};
    background-color: ${props => props.theme.backgroundLayout};
`

export const IconHotel = styled(RiHotelFill) <{ isSidebarCollapsed?: boolean, isCursorPointer?: boolean }>`
    display: inline-block;
    vertical-align: middle;
    margin-bottom: ${props => props.isSidebarCollapsed ? '2rem' : '0'};
    width: 3.5rem;
    height: auto;
    text-align: center;
    cursor: ${props => props.isCursorPointer ? 'pointer' : 'auto'};
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};

    &:hover {
        color: ${props => props.theme.textHoverSidebar};
    }
`

export const CtnTitle = styled.div<{ isSidebarCollapsed?: boolean }>`
    display: ${props => props.isSidebarCollapsed ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1rem;
    transition: ${globalConstStyles.transitionSidebarMenu};
`

export const TitleH1 = styled.h1`
    text-align: left;
    font-family: ${globalConstStyles.fontPoppins};
    color: ${props => props.theme.titleSidebar};
`

export const TitleText = styled.p`
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.6em;
    color: ${props => props.theme.textSidebar};
`

export const IconDashboard = styled(LuLayoutDashboard)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const IconBooking = styled(FaRegCalendarAlt)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const IconRooms = styled(MdOutlineBedroomParent)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const IconClient = styled(FaUser)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const IconUsers = styled(FaUserGear)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const NavOptionText = styled.p<{ isSidebarCollapsed?: boolean }>`
    display: ${props => props.isSidebarCollapsed ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.85em;
    transition: 0.25s ease;
    color: ${props => props.theme.textSidebar};
`

export const CtnNavOption = styled.div<{ isSidebarCollapsed?: boolean, routeIsActive: boolean }>`
    text-align: ${props => props.isSidebarCollapsed ? 'center' : 'left'};
    padding: 1em 0;
    cursor: pointer;

    &:hover {
        ${IconDashboard}, ${IconBooking}, ${IconRooms}, ${IconClient}, ${IconUsers} {
            color: ${props => (props.routeIsActive ? props.theme.textHoverActiveSidebar2 : props.theme.textHoverSidebar)};
        }
        ${NavOptionText} {
            font-weight: 700;
            color: ${props => props.theme.textHoverSidebar};
        }
    }

    ${IconDashboard}, ${IconBooking}, ${IconRooms}, ${IconClient}, ${IconUsers} {
        color: ${props => (props.routeIsActive ? props.theme.textHoverActiveSidebar2 : props.theme.iconSidebar)};
        background-color: ${props => (props.routeIsActive ? props.theme.textHoverSidebar : props.theme.textHoverActiveSidebar)};
    }
    ${NavOptionText} {
        font-size: ${props => (props.routeIsActive ? '1.1em' : '0.9rem')};
        font-weight: ${props => (props.routeIsActive ? '700' : '400')};
        color: ${props => (props.routeIsActive ? props.theme.textHoverSidebar : props.theme.iconSidebar)};
    }
`

export const CtnUser = styled.div<{ isSidebarCollapsed?: boolean }>`
    display: ${props => props.isSidebarCollapsed ? 'none' : 'block'};
    position: relative;
    margin-top: 2rem;
    padding: 6em 1em 1em;
    text-align: center;
    border-radius: 15%;
    box-shadow: ${props => props.theme.boxShadowCustomProfile};
`

export const ImgProfile = styled.img`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -125%);
    width: 4rem;
    height: 4rem;
    border-radius: 15%;
`

export const TitleH4 = styled.h4`
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 600;
    color: ${props => props.theme.titleSidebar};
`

export const TitleH5 = styled.h5`
    margin-top: 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    overflow-wrap: break-word;
    white-space: normal;
    color: ${props => props.theme.textSidebar};
`

export const ButtonEdit = styled.button`
    margin-top: 1rem;
    padding: 1em 2em;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    background-color: ${props => props.theme.buttonSidebar};
`

export const CtnCredits = styled.div<{ isSidebarCollapsed?: boolean }>`
    display: ${props => props.isSidebarCollapsed ? 'none' : 'block'};
`

export const TitleMayorCreditH5 = styled.h5`
    margin: 2rem 0 0.25rem;
    font-family: ${globalConstStyles.fontPoppins};
    color: ${props => props.theme.titleSidebar};
`

export const TitleMinorCreditH6 = styled.h6`
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    color: ${props => props.theme.textSidebar};
`