
import { styled } from 'styled-components'

import { HiMenuAlt2 } from "react-icons/hi"
import { MdOutlineEmail } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import * as gb from '../../styles/globalVars.js'


export const Header = styled.header`
    position: fixed;
    z-index: 1;
    left: ${props => props.display === 'collapsed' ? `${gb.widthSidebarMenuCollapsed}` : `${gb.widthSidebarMenuNotCollapsed}`};
    transition: ${gb.transitionSidebarMenu};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2em;
    width: ${props => props.display === 'collapsed' ? `calc(100% - ${gb.widthSidebarMenuCollapsed})` : `calc(100% - ${gb.widthSidebarMenuNotCollapsed})`};
    height: ${gb.heightHeader};
    box-shadow: 5px -5px 15px 0px rgba(254,209,209,0.45) inset;
    background-color: ${gb.colorWhiteFull};
`

export const IconMenuCollapsed = styled(HiMenuAlt2)`
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
`

export const IconMenuNotCollaped = styled(MdKeyboardDoubleArrowLeft)`
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
`

export const TitleH2 = styled.h2`
    display: inline-block;
    vertical-align: middle;
    margin-left: 2.5rem;
    font-family: ${gb.fontPoppins};
    font-size: 1.5em;
    font-weight: 700;
    color: ${gb.colorBlack26};
`

export const IconMail = styled(MdOutlineEmail)`
    margin: 0 0.75rem;
    vertical-align: middle;
    width: 1.75rem;
    height: auto;
    cursor: pointer;
`

export const IconBell = styled(FaRegBell)`
    margin: 0 0.75rem;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    cursor: pointer;
`

export const IconLogOut = styled(AiOutlineLogout)`
    margin: 0 0.75rem;
    vertical-align: middle;
    width: 1.75rem;
    height: auto;
    cursor: pointer;
`