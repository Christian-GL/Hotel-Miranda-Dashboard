
import { styled } from 'styled-components'

import { HiMenuAlt2 } from "react-icons/hi"
import { MdOutlineEmail } from "react-icons/md"
import { FaRegBell } from "react-icons/fa6"
import { AiOutlineLogout } from "react-icons/ai"
import { FaMoon } from "react-icons/fa"
import { FiSun } from "react-icons/fi"
import { MdKeyboardDoubleArrowLeft } from "react-icons/md"

import * as globalConstStyles from '../../styles/globalConstStyles.ts'


export const Header = styled.header<{ display?: string }>`
    position: fixed;
    z-index: 2;
    left: ${props => props.display === 'collapsed' ? `${globalConstStyles.widthSidebarMenuCollapsed}` : `${globalConstStyles.widthSidebarMenuNotCollapsed}`};
    transition: ${globalConstStyles.transitionSidebarMenu};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2em;
    width: ${props => props.display === 'collapsed' ? `calc(100% - ${globalConstStyles.widthSidebarMenuCollapsed})` : `calc(100% - ${globalConstStyles.widthSidebarMenuNotCollapsed})`};
    height: ${globalConstStyles.heightHeader};
    box-shadow: 5px 0px 15px 0px rgba(254,209,209,0.45);
    background-color: ${props => props.theme.backgroundLayout};
`

export const IconMenuCollapsed = styled(HiMenuAlt2)`
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
    color: ${props => props.theme.iconHeader};
`

export const IconMenuNotCollaped = styled(MdKeyboardDoubleArrowLeft)`
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
    color: ${props => props.theme.iconHeader};
`

export const TitleH2 = styled.h2`
    display: inline-block;
    vertical-align: middle;
    margin-left: 2.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.5em;
    font-weight: 700;
    color: ${props => props.theme.iconHeader};
`

export const IconMail = styled(MdOutlineEmail)`
    margin: 0 0.75rem;
    padding: 0.5em;
    vertical-align: middle;
    width: 2.75rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    color: ${props => props.theme.iconHeader};
`

export const IconBell = styled(FaRegBell)`
    margin: 0 0.75rem;
    padding: 0.5em;
    vertical-align: middle;
    width: 2.75rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    color: ${props => props.theme.iconHeader};
`

export const Moon = styled(FaMoon)`
    margin: 0 0.75rem;
    padding: 0.5em;
    vertical-align: middle;
    width: 2.75rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.25s ease;
    color: ${props => props.theme.iconHeader};

    &:hover {
        color: ${props => props.theme.iconHoverHeader};
        background-color: ${props => props.theme.iconThemeHoverBackgroundHeader};
    }
`

export const Sun = styled(FiSun)`
    margin: 0 0.75rem;
    padding: 0.5em;
    vertical-align: middle;
    width: 2.75rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.25s ease;
    color: ${props => props.theme.iconHeader};

    &:hover {
        color: ${props => props.theme.iconHoverHeader};
        background-color: ${props => props.theme.iconThemeHoverBackgroundHeader};
    }
`

export const IconLogOut = styled(AiOutlineLogout)`
    margin: 0 0.75rem;
    padding: 0.5em;
    vertical-align: middle;
    width: 2.75rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.25s ease;
    color: ${props => props.theme.iconHeader};

    &:hover {
        color: ${props => props.theme.iconHoverHeader};
        background-color: ${props => props.theme.iconHoverBackgroundHeader};
    }
`