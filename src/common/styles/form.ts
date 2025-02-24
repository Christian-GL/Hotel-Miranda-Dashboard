
import { styled } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

import { FaUser } from "react-icons/fa"
import { FaRegCalendarAlt } from "react-icons/fa"
import { MdOutlineBedroomParent } from "react-icons/md"
import { BiSolidPlusCircle } from "react-icons/bi"
import { RiExchangeFill } from "react-icons/ri"
import { MdContacts } from "react-icons/md"
import { IoEye } from "react-icons/io5"
import { IoMdEyeOff } from "react-icons/io"

import * as globalConstStyles from './globalConstStyles.ts'


export const DivCtnForm = styled.div`
    padding: 0 2em;
    background-color: ${props => props.theme.backgroundPage};
`

export const DivIcon = styled.div`
    padding-top: 2em;
    text-align: center;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    background-color: transparent;
`

export const DivCtnIcons = styled.div`
    position: relative;
    margin: 0 auto;
    width: 5rem;
    text-align: center;
    position: relative;
`

export const IconUser = styled(FaUser)`
    width: 4rem;
    height: auto;
    color: ${props => props.theme.iconForm};
`

export const IconCalendar = styled(FaRegCalendarAlt)`
    width: 4.5rem;
    height: auto;
    color: ${props => props.theme.iconForm};
`

export const IconBed = styled(MdOutlineBedroomParent)`
    width: 5rem;
    height: auto;
    color: ${props => props.theme.iconForm};
`

export const IconContact = styled(MdContacts)`
    width: 4.5rem;
    height: auto;
    color: ${props => props.theme.iconForm};
`

export const IconPlus = styled(BiSolidPlusCircle)`
    position: absolute;
    top: 50%;
    transform: translate(-75%, 0%);
    padding: 0.1em;
    width: 3rem;
    height: auto;
    border-radius: 50%;
    color: ${props => props.theme.iconForm};
    background-color: ${props => props.theme.backgroundPage};
`

export const IconUpdate = styled(RiExchangeFill)`
    position: absolute;
    top: 50%;
    transform: translate(-75%, 0%);
    padding: 0.1em;
    width: 3rem;
    height: auto;
    border-radius: 50%;
    color: ${props => props.theme.iconForm};
    background-color: ${props => props.theme.backgroundPage};
`

export const TitleForm = styled.h2`
    padding-top: 1.5rem;
    text-align: center;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.75em;
    font-weight: 600;
    color: ${props => props.theme.textLabelForm};
    background-color: ${props => props.theme.backgroundPage};
`

export const Form = styled.form`
    padding: 2em;
    width: 100%;
    border-bottom-left-radius: 2.5rem;
    border-bottom-right-radius: 2.5rem;
    background-color: ${props => props.theme.backgroundPage};
`

export const ImgRoom = styled.img`
    padding-left: 2em;
    width: 100%;
    height: auto;
    max-width: 10rem;  
    max-height: 7.5rem;
`

export const ImgUser = styled.img`
    padding-left: 2em;
    width: 100%;
    height: auto;
    max-width: 7.5rem;
    max-height: 7.5rem;
`

export const DivCtnEntry = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1em 0;
`

export const LabelText = styled.label<{ minWidth?: string, margin?: string }>`
    min-width: ${props => props.minWidth || '10rem'};
    margin: ${props => props.margin || '0'};
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    color: ${props => props.theme.textLabelForm};
`

export const LabelTextNote = styled.label`
    margin-left: 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    color: ${props => props.theme.textLabelForm};
`

export const DivCtnEntryBookings = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    display: grid;
    padding: 1em 0;
`

export const LabelBookings = styled.label`
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.8em;
    font-weight: 500;
    color: ${props => props.theme.textLabelForm};
`

export const LabelTextBookingStatus = styled.label`
    min-width: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.theme.textLabelForm};
`

export const InputText = styled.input`
    padding: 1em;
    text-align: left;
    width: 100%;
    min-width: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${props => props.theme.textForm};
`

export const InputTextPhoto = styled.input`
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    color: ${props => props.theme.textLabelForm};
`

export const GlobalDateTimeStyles = createGlobalStyle`
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: auto;
        height: auto;
        background: transparent;
        cursor: pointer;
    }

    input[type="date"], input[type="time"] {
        position: relative;  // Establecer posición relativa en los inputs de fecha y hora
    }
`

export const InputDate = styled.input`
    padding: 1em;
    width: 100%;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${props => props.theme.textForm};
`

export const TextAreaJobDescription = styled.textarea`
    padding: 1em;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${props => props.theme.textForm};
`

export const SelectAmenities = styled.select`
    min-width: 10rem;
    padding: 1em;
    height: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    color: ${props => props.theme.textForm};
`

export const Select = styled.select`
    padding: 1em;
    width: 100%;
    min-width: 10rem;
    max-height: 5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 500;
    border: none;
    border-radius: 1rem;
    color: ${props => props.theme.textForm};

    option[value="null"] {
        display: none;
    }
`

export const Option = styled.option`
    padding: 0em;
`

export const DivButtonCreateUser = styled.div`
    padding-top: 2em;
    text-align: center;
    background-color: ${props => props.theme.backgroundPage};
`

export const DivButtonHidePassword = styled.div`
    margin-left: 1rem;
    text-align: center;
`

export const EyeOpen = styled(IoEye)`
    vertical-align: middle;
    padding: 0.5em;
    width: 3rem;
    height: auto;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props => props.theme.iconEye};
    background-color: ${props => props.theme.iconEyeBackground};
`

export const EyeClose = styled(IoMdEyeOff)`
    vertical-align: middle;
    padding: 0.5em;
    width: 3rem;
    height: auto;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props => props.theme.iconEye};
    background-color: ${props => props.theme.iconEyeBackground};
`
