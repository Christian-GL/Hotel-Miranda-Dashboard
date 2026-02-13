
import { styled } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import Select from "react-select"

import { FaUser } from "react-icons/fa"
import { FaRegCalendarAlt } from "react-icons/fa"
import { MdOutlineBedroomParent } from "react-icons/md"
import { BiSolidPlusCircle } from "react-icons/bi"
import { RiExchangeFill } from "react-icons/ri"
import { FaUserGear } from "react-icons/fa6"
import { IoEye } from "react-icons/io5"
import { IoMdEyeOff } from "react-icons/io"

import * as globalConstStyles from './globalConstStyles'


export const CtnSection = styled.section`
    height: 100%;
    padding: 5em 5em 0;
    overflow-y: auto;
    background-color: ${props => props.theme.backgroundPage};
`

export const CtnPrimaryIcons = styled.div`
    text-align: center;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    background-color: transparent;
`

export const CtnSecondaryIcons = styled.div`
    position: relative;
    margin: 0 auto;
    width: 5rem;
    text-align: center;
    position: relative;
`

export const IconUser = styled(FaUserGear)`
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

export const IconClient = styled(FaUser)`
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

export const CtnForm = styled.div`
    display: flex;
    justify-content: center;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    background-color: transparent;
`

export const Form = styled.form`
    width: 100%;
    min-width: 25rem;
    max-width: 50rem;
    padding: 4em 0 2em;
    text-align: center;
    background-color: ${props => props.theme.backgroundPage};
`

export const ImgRoom = styled.img`
    padding-top: 1rem;
    width: 100%;
    height: auto;
    max-width: 10rem;  
    max-height: 7.5rem;
`

export const ImgUser = styled.img`
    padding-top: 1rem;
    width: 100%;
    height: auto;
    max-width: 7.5rem;
    max-height: 7.5rem;
`

export const CtnEntryVertical = styled.div<{ removePaddingSeparator?: boolean }>`
    display: flex;
    flex-direction: column;
    padding: ${props => props.removePaddingSeparator ? '0' : '0 0 2.5em'};
    gap: 0.25rem;
`

export const CtnEntryHorizontal = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;

    // Para todos los hijos repartir equitativamente el espacio:
    & > * {
        flex: 1;
    }
`

export const Text = styled.label`
    text-align: left;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    color: ${props => props.theme.textLabelForm};
`

export const TextNote = styled.label`
    margin-left: 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    color: ${props => props.theme.textLabelForm};
`

export const CtnEntryBookings = styled.div`
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

export const TextBookingStatus = styled.label`
    min-width: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.theme.textLabelStatusForm};
`

export const TextInfoBooking = styled.label`
    margin-right: 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    color: ${props => props.theme.textLabelForm};
`

export const InputText = styled.input`
    padding: 0 1em;
    text-align: left;
    width: 100%;
    height: 2.5rem;
    min-width: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    border: 1px solid ${props => props.theme.borderElementForm};
    border-radius: 0.25rem;
    outline: none;
    color: ${props => props.theme.textForm};

    &:hover {
        border-color: ${props => props.theme.borderElementHoverForm};
    }
`

export const InputTextPhoto = styled.input`
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    color: ${props => props.theme.textLabelForm};
`

export const GlobalDateTimeStyles = createGlobalStyle`
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
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

    input[type="datetime-local"] {
        position: relative;
    }
`

export const InputDate = styled.input`
    padding: 0 1em;
    width: 100%;
    height: 2.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 0.5rem;
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
    border-radius: 0.5rem;
    outline: none;
    color: ${props => props.theme.textForm};
`

export const SelectReact = styled(Select) <{ width?: string }>`
    width: ${props => props.width || '100%'};
    font-family: ${globalConstStyles.fontPoppins};
    color: ${props => props.theme.textForm};
`

export const CtnButtonCreateUser = styled.div`
    padding-top: 2em;
    text-align: center;
    background-color: ${props => props.theme.backgroundPage};
`

export const CtnButtonHidePassword = styled.div`
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

// !!! ELIMINAR SI NO SE USAN LAS SIGUIENTES CONSTANTES:
export const ButtonAddDelete = styled.button<{ margin?: string; isAdd?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${props => props.margin || '0rem'};
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    font-size: 1.25em;
    font-weight: 700;
    cursor: pointer;
    color: ${props => props.theme.buttonFormText};
    background-color: ${props => props.isAdd ? props.theme.buttonFormAdd : props.theme.buttonFormDelete || 'green'};    // !!! EL COLOR NO SEA PUESTO A PIÑON
`

export const ArrayBox = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem;
    gap: 0.5rem;
    width: fit-content;
    font-weight: 600;
    max-width: 35rem;
    border: 2px solid black;    // !!! EL COLOR NO SEA PUESTO A PIÑON
    border-radius: 0.4rem;
    color: gray;                // !!! EL COLOR NO SEA PUESTO A PIÑON
    background-color: gray;     // !!! EL COLOR NO SEA PUESTO A PIÑON
`

export const ArrayItem = styled.span`
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
`

export const SelectSingle = styled.select`
    padding: 1em;
    width: 100%;
    min-width: 10rem;
    max-height: 5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    color: ${props => props.theme.textForm};

    option[value="null"] {
        display: none;
    }
`

export const SelectMultiple = styled.select<{ width?: string }>`
    padding: 1em;
    min-width: 10rem;
    width: ${props => props.width || '10rem'};
    height: 10rem;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    color: ${props => props.theme.textForm};
`

export const Option = styled.option`
    padding: 0em;
`