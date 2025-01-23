
import { styled } from 'styled-components'

import { FaUser } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";
import { BiSolidPlusCircle } from "react-icons/bi";
import { RiExchangeFill } from "react-icons/ri";
import { MdContacts } from "react-icons/md";

import * as gb from '../../styles/globalVars.js'


export const DivCtnForm = styled.div`
    padding: 2em;
    background-color: ${gb.colorGrayBackgroundPage};
`

export const DivIcon = styled.div`
    padding-top: 2em;
    text-align: center;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    background-color: ${gb.colorWhiteFull};
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
    color: ${gb.colorBlack26};
`

export const IconCalendar = styled(FaRegCalendarAlt)`
    width: 4.5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const IconBed = styled(MdOutlineBedroomParent)`
    width: 5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const IconContact = styled(MdContacts)`
    width: 4.5rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const IconPlus = styled(BiSolidPlusCircle)`
    position: absolute;
    top: 50%;
    transform: translate(-75%, 0%);
    padding: 0.1em;
    width: 3rem;
    height: auto;
    border-radius: 50%;
    color: ${gb.colorBlack26};
    background-color: ${gb.colorWhiteFull};
`

export const IconUpdate = styled(RiExchangeFill)`
    position: absolute;
    top: 50%;
    transform: translate(-75%, 0%);
    padding: 0.1em;
    width: 3rem;
    height: auto;
    border-radius: 50%;
    color: ${gb.colorBlack26};
    background-color: ${gb.colorWhiteFull};
`

export const TitleForm = styled.h2`
    padding-top: 1.5rem;
    text-align: center;
    font-family: ${gb.fontPoppins};
    font-size: 1.75em;
    font-weight: 600;
    color: ${gb.colorBlack26};
    background-color: ${gb.colorWhiteFull};
`

export const Form = styled.form`
    padding: 2em;
    width: 100%;
    border-bottom-left-radius: 2.5rem;
    border-bottom-right-radius: 2.5rem;
    background-color: ${gb.colorWhiteFull};
`

export const ImgRoom = styled.img`
    padding-left: 2em;
    width: 100%;
    height: auto;
    max-width: 20rem;  
    max-height: 15rem;
`

export const ImgUser = styled.img`
    padding-left: 2em;
    width: 100%;
    height: auto;
    max-width: 10rem;
    max-height: 10rem;
`

export const DivCtnEntry = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1em 0;
`

export const LabelText = styled.label`
    min-width: 10rem;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    color: ${gb.colorBlack26};
`

export const InputText = styled.input`
    padding: 1em;
    text-align: left;
    width: 100%;
    min-width: 10rem;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    border: 1px solid ${gb.colorBlack26};
    border-radius: 1rem;
    outline: none;
    color: ${gb.colorBlack26};
`

export const InputTextPhoto = styled.input`
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    color: ${gb.colorBlack26};
`

export const InputDate = styled.input`
    padding: 1em;
    width: 100%;
    font-family: ${gb.fontPoppins};
    border: 1px solid ${gb.colorBlack26};
    border-radius: 1rem;
    outline: none;
    color: ${gb.colorBlack26};

    // COMO APLICAR LO DE ABAJO ??? (ver home.scss del proyecto web)
    // input {
    //     position: relative;
    // }

    // input[type="date"]::-webkit-calendar-picker-indicator {
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     width: auto;
    //     height: auto;
    //     background: transparent;
    //     cursor: pointer;
    // }
`

export const TextAreaJobDescription = styled.textarea`
    padding: 1em;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    border: 1px solid ${gb.colorBlack26};
    border-radius: 1rem;
    outline: none;
    color: ${gb.colorBlack26};
`

export const SelectAmenities = styled.select`
    min-width: 10rem;
    padding: 1em;
    height: 10rem;
    font-family: ${gb.fontPoppins};
    border: 1px solid ${gb.colorBlack26};
    color: ${gb.colorBlack26};
`

export const Select = styled.select`
    padding: 1em;
    min-width: 10rem;
    font-family: ${gb.fontPoppins};
    font-weight: 500;
    border: 1px solid ${gb.colorBlack26};
    border-radius: 1rem;
    color: ${gb.colorBlack26};
`

export const Option = styled.option`
    padding: 0em;
`

export const DivButtonCreateUser = styled.div`
    padding-top: 2em;
    text-align: center;
    background-color: ${gb.colorWhiteFull};
`