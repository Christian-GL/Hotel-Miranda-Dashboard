
import { styled } from 'styled-components'

import { ImUserPlus } from "react-icons/im";

import * as gb from '../../../../common/styles/globalVars.js'


export const SectionPageUserCreate = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    border: 5px solid blue;
    // background-color: ${gb.colorGrayBackgroundPage};
    background-color: lightblue;
`

export const IconHotel = styled(ImUserPlus)`
    width: 4rem;
    height: auto;
    color: ${gb.colorBlack26};
`

export const Form = styled.form`
    margin-top: 2rem;
    width: 100%;
`

export const DivCtnEntry = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1em 0;
`

export const LabelText = styled.label`
    width: 10rem;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    color: ${gb.colorBlack26};
`

export const InputText = styled.input`
    margin-left: 2rem;
    padding: 1em;
    text-align: left;
    width: 100%;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${gb.colorBlack26};
`

export const InputDate = styled.input`
    margin-left: 2rem;
    padding: 1em;
    width: 100%;
    font-family: ${gb.fontPoppins};
    border: none;
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
    margin-left: 2rem;
    padding: 1em;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${gb.colorBlack26};
`

export const SelectStatus = styled.select`
    // margin-left: 0.5rem;
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    border: none;
    border-radius: 1rem;
    color: ${gb.colorBlack26};
`

export const OptionStatus = styled.option`
    padding: 0em;
`