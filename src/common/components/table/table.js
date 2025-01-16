
import { styled } from 'styled-components'

import { ImPhone } from "react-icons/im";

import * as gb from '../../styles/globalVars.js'


export const Table = styled.table`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, 1fr);
    grid-template-columns: repeat(${props => props.columnlistlength}, 1fr);
    grid-gap: 1.5rem 0;
    // padding-bottom: 1em;
    background-color: ${gb.colorWhiteFull};
`

export const THTable = styled.th`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    max-heigth: 5rem;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 700;
    color: ${gb.colorGray39};
`

export const TDTable = styled.td`
    display: flex;
    justify-content: center;
    align-items: ${props => props.alignitems === 'left' ? 'left' : 'center'};
    flex-direction: ${props => props.flexdirection === 'row' ? 'row' : 'column'};
    padding: 1em;
    min-width: ${props => props.minwidth};
    max-width: ${props => props.maxwidth};
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    color: ${gb.colorGray39};
`

export const ImgTable = styled.img`
    margin: auto 0;
    width: 100%;
    height: 6rem;
    border-radius: 0.5rem;
`

export const PTextPerNight = styled.p`
    color: ${gb.colorGreen};
`

export const TextGreenTableH6 = styled.h6`
    text-align: left;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    white-space: nowrap;
    color: ${gb.colorGreen};
`

export const TextGrayTableH6 = styled.h6`
    text-align: left;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    white-space: nowrap;
    color: ${gb.colorGray39};
`

export const TextBlackTableH6 = styled.h6`
    text-align: left;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    white-space: nowrap;
    color: ${gb.colorBlack21};
`

export const IconPhone = styled(ImPhone)`
    padding-right: 0.5em;
    width: 2rem;
    height: auto;
    color: ${gb.colorGray39};
    background-color: ${gb.colorWhiteFull};
`