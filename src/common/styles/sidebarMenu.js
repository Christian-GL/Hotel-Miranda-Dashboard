
import { styled } from 'styled-components'

import { FaRegCalendarAlt } from "react-icons/fa";
import { RiHotelFill } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineBedroomParent } from "react-icons/md";
import { MdContacts } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import * as gb from './globalVars.js'


export const AsideSideNavigationBar = styled.aside`
    // position: sticky;
    display: flex;
    flex-direction: column;
    align-items: ${props => props.display === 'collapsed' ? 'center' : 'left'};;
    justify-content: ${props => props.display === 'collapsed' ? 'flex-start' : 'space-between'};
    padding: ${props => props.display === 'collapsed' ? '1em' : '1em 2.5em'};
    width: ${props => props.display === 'collapsed' ? '5rem' : '18rem'};                       // <---- !!!!!
    height: 100vh;
    text-align: left;
    transition: 0.5s ease;
    background: ${gb.colorWhiteFull};
    border: 1px solid black;
`

export const IconHotel = styled(RiHotelFill)`
    display: inline-block;
    vertical-align: middle;
    margin-bottom: ${props => props.display === 'collapsed' ? '2rem' : '0'};
    width: 3.5rem;
    height: auto;
    text-align: center;
    color: ${gb.colorGrayIconHotel};
`

export const DivCtnTitle = styled.div`
    display: ${props => props.display === 'collapsed' ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1rem;
`

export const TitleH1 = styled.h1`
    text-align: left;
    font-family: ${gb.fontPoppins};
    color: ${gb.colorBlack21};
`

export const PTitleText = styled.p`
    font-family: ${gb.fontPoppins};
    font-size: 0.6em;
    color: ${gb.colorGray};
`

// Nav options
export const DivCtnNavOption = styled.div`
    padding: 1em 0;
    cursor: pointer;
`

export const IconDashboard = styled(LuLayoutDashboard)`
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    color: ${gb.colorGrayIconAndTextNavOption};
`

export const IconBooking = styled(FaRegCalendarAlt)`
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    color: ${gb.colorGrayIconAndTextNavOption};
`

export const IconRooms = styled(MdOutlineBedroomParent)`
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    color: ${gb.colorGrayIconAndTextNavOption};
`

export const IconContact = styled(MdContacts)`
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    color: ${gb.colorGrayIconAndTextNavOption};
`

export const IconUsers = styled(FaUser)`
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: auto;
    color: ${gb.colorGrayIconAndTextNavOption};
`

export const PNavOptionText = styled.p`
    display: ${props => props.display === 'collapsed' ? 'none' : 'inline-block'};
    vertical-align: middle;
    margin-left: 1.5rem;
    font-family: ${gb.fontPoppins};
    font-size: 0.85em;
    color: ${gb.colorGrayIconAndTextNavOption};
`

// Profile
export const DivCtnUser = styled.div`
    display: ${props => props.display === 'collapsed' ? 'none' : 'block'};
    position: relative;
    padding: 3em 1em 1em;
    text-align: center;
    border-radius: 15%;
    box-shadow: 0 0.10em 0.15em ${gb.colorGray}, // bottom
            -0.1em 0.10em 0.5em ${gb.colorGray}, // left
            0.1em 0.10em 0.5em ${gb.colorGray}; // right
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
    font-family: ${gb.fontPoppins};
    font-weight: 600;
    color: ${gb.colorGrayTitleProfile};
`

export const TitleH5 = styled.h5`
    margin: 1rem 0;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    color: ${gb.colorGrayEmailProfile};
`

export const ButtonContactUs = styled.button`
    padding: 1em 2em;
    border: none;
    border-radius: 15%;
    cursor: pointer;
    background-color: ${gb.colorGrayButtonProfile};
`

// Credits
export const DivCtnCredits = styled.div`
    display: ${props => props.display === 'collapsed' ? 'none' : 'block'};
`

export const TitleMayorCreditH5 = styled.h5`
    margin: 2rem 0 0.25rem;
    font-family: ${gb.fontPoppins};
    color: ${gb.colorBlack21};
`

export const TitleMinorCreditH6 = styled.h6`
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    color: ${gb.colorGrayCreditMinorTitle};
`