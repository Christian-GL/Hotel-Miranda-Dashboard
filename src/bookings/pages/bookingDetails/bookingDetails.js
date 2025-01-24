
import { styled } from 'styled-components'

import { ImPhone } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";
import { BsChatDots } from "react-icons/bs";
import { FaWifi } from "react-icons/fa";
import { IoBedSharp } from "react-icons/io5";
import { GoShieldCheck } from "react-icons/go";

import * as gb from '../../../common/styles/globalVars.js'


export const SectionPageBookingDetails = styled.section`
    display: flex;
    flex-direction: row;
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    border: 5px solid blue;
    background-color: ${gb.colorGrayBackgroundPage};
`

export const DivSection = styled.div`
    padding: ${props => props.padding};
    width: 50%;
    min-width: 35rem;
    height: auto;
`

export const DivCtnImgAndMainData = styled.div`
    position: relative;
    width: 100%;
    max-width: 35rem;
`

export const IconOptions = styled(SlOptionsVertical)`
    position: absolute;
    top: 1rem;
    left: 30rem;
    transform: translate(-50%, -50%);
    padding: 0.75em;
    width: 2.5rem;
    height: auto;
    color: ${gb.colorGray};
`

export const ImgProfile = styled.img`
    display: inline-block;
    vertical-align: middle;
    margin-right: 2rem;
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 1rem;
`

export const DivCtnMainData = styled.div`
    display: inline-block;
    vertical-align: middle;
    width: 65%;
`

export const DivCtnNameId = styled.div`
    display: flex;
    flex-direction: column;
`

export const NameProfileH2 = styled.h2`
    font-family: ${gb.fontPoppins};
    font-size: 1.5em;
    color: ${gb.colorBlack21};
`

export const SubTittleH4 = styled.h4`
    padding-top: ${props => props.paddingtop};
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-size: ${props => props.fontsize};
    font-weight: 500;
    color: ${props => props.color};
`

export const DivCtnContactMessage = styled.div`
    margin-top: 1.25rem;
`

export const IconPhone = styled(ImPhone)`
    vertical-align: middle;
    padding: 0.75em;
    width: 3rem;
    height: auto;
    border-radius: 0.75rem;
    border: 1px solid ${gb.colorGrayBorderIconBookingDetails};
    cursor: pointer;
`

export const ButtonSendMessage = styled.button`
    position: relative;
    margin-left: 1rem;
    vertical-align: middle;
    padding: 1.25em 2em 1.25em 4.5em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    color: ${gb.colorWhiteFull};
    background-color: ${gb.colorGrayIconHotel};
`

export const IconChat = styled(BsChatDots)`
    position: absolute;
    top: 50%;
    left: 1.75rem;
    transform: translate(-50%, -50%);
    padding: 0.75em;
    width: 2.5rem;
    height: auto;
    color: ${gb.colorWhiteFull};
`

export const DivCheckInOut = styled.div`
    padding: 2em 0;
    border-bottom: 1px solid ${gb.colorLightGray};
`

export const Div50PercentageSection = styled.div`
    display: inline-block;
    vertical-align: top;
    width: 50%;
`

export const PTextInfo = styled.p`
    padding: 1em 0;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    color: ${gb.colorGrayTextInfoBookingDetails};
`

export const DivCtnInfo = styled.div`
    padding: 2em 0;
`

export const DivCtnFacilities = styled.div`
    padding: 1em 0;
`

export const ButtonFacility = styled.button`
    position: relative;
    vertical-align: middle;
    margin: 1rem 1rem 0 0;
    padding: ${props => props.withicon === 'true' ? '1.25em 2em 1.25em 4.5em' : '1em'};
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    color: ${gb.colorGrayIconHotel};
    background-color: ${gb.colorLightGray};
`

export const IconBed = styled(IoBedSharp)`
    position: absolute;
    top: 50%;
    left: 1.75rem;
    transform: translate(-50%, -50%);
    padding: 0.75em;
    width: 2.5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const IconShieldCheck = styled(GoShieldCheck)`
    position: absolute;
    top: 50%;
    left: 1.75rem;
    transform: translate(-50%, -50%);
    padding: 0.75em;
    width: 2.5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const IconWiFi = styled(FaWifi)`
    position: absolute;
    top: 50%;
    left: 1.75rem;
    transform: translate(-50%, -50%);
    padding: 0.75em;
    width: 2.5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const ImgRoom = styled.img`
    width: 100%;
    height: auto;
    border-top-right-radius: 7.5%;
    border-bottom-right-radius: 7.5%;
`