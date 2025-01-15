
import { styled } from 'styled-components'

import { HiMenuAlt2 } from "react-icons/hi"
import { MdOutlineEmail } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import * as gb from '../styles/globalVars.js'


export const Header = styled.header`
    // position: fixed;
    // top: 0;
    // left: ${props => props.display === 'collapsed' ? '5rem' : '18rem'};
    transition: 0.5s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    width: 100%;
    height: auto;
    background-color: ${gb.colorWhiteFull};

    border-bottom: 5px solid red;
`

export const IconMenuCollapsed = styled(HiMenuAlt2)`
    margin-left: 1rem;
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
`

export const IconMenuNotCollaped = styled(MdKeyboardDoubleArrowLeft)`
    margin-left: 1rem;
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
    font-size: 1.25em;
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