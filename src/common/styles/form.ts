
import { BiSolidPlusCircle } from "react-icons/bi"
import { FaRegCalendarAlt, FaUser } from "react-icons/fa"
import { FaUserGear } from "react-icons/fa6"
import { IoMdEyeOff } from "react-icons/io"
import { IoEye } from "react-icons/io5"
import { MdOutlineBedroomParent } from "react-icons/md"
import { RiExchangeFill } from "react-icons/ri"
import Select from "react-select"
import { createGlobalStyle, styled } from 'styled-components'

import * as globalConstStyles from 'common/styles/globalConstStyles'


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
    margin-top: 1rem;
    width: 100%;
    height: auto;
    max-width: 10rem;  
    max-height: 7.5rem;
`

export const ImgUser = styled.img`
    margin-top: 1rem;
    width: 100%;
    max-width: 7.5rem;
    max-height: 7.5rem;
    aspect-ratio: 1 / 1;
`

export const CtnEntryVertical = styled.div<{ removePaddingSeparator?: boolean }>`
    display: flex;
    flex-direction: column;
    padding: ${props => props.removePaddingSeparator ? '0' : '0 0 2.5em'};
    gap: 0.25rem;
`

export const CtnEntryHorizontal = styled.div<{ naturalSizes?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;

    // Para todos los hijos repartir equitativamente el espacio:
    ${props => !props.naturalSizes &&
        `
            & > * {
                flex: 1;
            }
        `
    }
`

export const Text = styled.label`
    text-align: left;
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
    border: 1px solid ${props => props.theme.borderElementForm};
    border-radius: 0.25rem;
    outline: none;
    color: ${props => props.theme.textForm};

    &:hover {
        border-color: ${props => props.theme.borderElementHoverForm};
    }
`

export const TextAreaJobDescription = styled.textarea`
    padding: 1em;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    border: 1px solid ${props => props.theme.borderElementForm};
    border-radius: 0.25rem;
    outline: none;
    resize: none;
    color: ${props => props.theme.textForm};

    &:hover {
        border-color: ${props => props.theme.borderElementHoverForm};
    }
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
    text-align: center;
`

export const EyeOpen = styled(IoEye)`
    vertical-align: middle;
    padding: 0.5em;
    width: 2.75rem;
    height: auto;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props => props.theme.iconEye};
    background-color: ${props => props.theme.iconEyeBackground};
`

export const EyeClose = styled(IoMdEyeOff)`
    vertical-align: middle;
    padding: 0.5em;
    width: 2.75rem;
    height: auto;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props => props.theme.iconEye};
    background-color: ${props => props.theme.iconEyeBackground};
`