
import { styled } from 'styled-components'

import { FaRegCalendarAlt } from "react-icons/fa";
import { RiHotelFill } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineBedroomParent } from "react-icons/md";
import { MdClients } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import * as globalConstStyles from '../../styles/globalConstStyles'


export const AsideSideNavigationBar = styled.aside<{ display?: string }>`
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: ${props => props.display === 'collapsed' ? 'center' : 'left'};
    justify-content: ${props => props.display === 'collapsed' ? 'flex-start' : 'space-between'};
    padding: ${props => props.display === 'collapsed' ? '1em' : '1em 2.5em'};
    width: ${props => props.display === 'collapsed' ? `${globalConstStyles.widthSidebarMenuCollapsed}` : `${globalConstStyles.widthSidebarMenuNotCollapsed}`};
    height: 100vh;
    text-align: left;
    transition: ${globalConstStyles.transitionSidebarMenu};
    background-color: ${props => props.theme.backgroundLayout};
`

export const IconHotel = styled(RiHotelFill) <{ display?: string }>`
    display: inline-block;
    vertical-align: middle;
    margin-bottom: ${props => props.display === 'collapsed' ? '2rem' : '0'};
    width: 3.5rem;
    height: auto;
    text-align: center;
    cursor: pointer;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};

    &:hover {
        color: ${props => props.theme.textHoverSidebar};
    }
`

export const DivCtnTitle = styled.div<{ display?: string }>`
    display: ${props => props.display === 'collapsed' ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1rem;
    transition: ${globalConstStyles.transitionSidebarMenu};
`

export const TitleH1 = styled.h1`
    text-align: left;
    font-family: ${globalConstStyles.fontPoppins};
    color: ${props => props.theme.titleSidebar};
`

export const PTitleText = styled.p`
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

export const IconClient = styled(MdClients)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const IconUsers = styled(FaUser)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.5em;
    width: 2.5rem;
    height: auto;
    border-radius: 25%;
    transition: 0.25s ease;
    color: ${props => props.theme.iconSidebar};
`

export const PNavOptionText = styled.p<{ display?: string }>`
    display: ${props => props.display === 'collapsed' ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.85em;
    transition: 0.25s ease;
    color: ${props => props.theme.textSidebar};
`

export const DivCtnNavOption = styled.div<{ display?: string, routeIsActive: boolean }>`
    text-align: ${props => props.display === 'collapsed' ? 'center' : 'left'};
    padding: 1em 0;
    cursor: pointer;

    &:hover {
        ${IconDashboard}, ${IconBooking}, ${IconRooms}, ${IconClient}, ${IconUsers} {
            color: ${props => (props.routeIsActive ? props.theme.textHoverActiveSidebar2 : props.theme.textHoverSidebar)};
        }
        ${PNavOptionText} {
            font-weight: 700;
            color: ${props => props.theme.textHoverSidebar};
        }
    }

    ${IconDashboard}, ${IconBooking}, ${IconRooms}, ${IconClient}, ${IconUsers} {
        color: ${props => (props.routeIsActive ? props.theme.textHoverActiveSidebar2 : props.theme.iconSidebar)};
        background-color: ${props => (props.routeIsActive ? props.theme.textHoverSidebar : props.theme.textHoverActiveSidebar)};
    }
    ${PNavOptionText} {
        font-size: ${props => (props.routeIsActive ? '1.1em' : '0.9rem')};
        font-weight: ${props => (props.routeIsActive ? '700' : '400')};
        color: ${props => (props.routeIsActive ? props.theme.textHoverSidebar : props.theme.iconSidebar)};
    }
`

export const DivCtnUser = styled.div<{ display?: string }>`
    display: ${props => props.display === 'collapsed' ? 'none' : 'block'};
    position: relative;
    margin-top: 2rem;
    padding: 3em 1em 1em;
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
    margin: 1rem 0;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    overflow-wrap: break-word;
    white-space: normal;
    color: ${props => props.theme.textSidebar};
`

export const ButtonEdit = styled.button`
    padding: 1em 2em;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    background-color: ${props => props.theme.buttonSidebar};
`

export const DivCtnCredits = styled.div<{ display?: string }>`
    display: ${props => props.display === 'collapsed' ? 'none' : 'block'};
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