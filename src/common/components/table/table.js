
import { styled } from 'styled-components'

// ICONS

import * as gb from '../../styles/globalVars.js'


export const UlTableRoomList = styled.ul`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, 1fr);
    grid-template-columns: repeat(${props => props.columnlistlength}, 1fr);
    // grid-auto-flow: column;
    grid-gap: 1.5rem 0;
    padding-bottom: 1em;
    list-style: none;
    background-color: ${gb.colorWhiteFull};
`

export const LiTable = styled.li`
    display: flex;
    justify-content: ${props => props.justifycontent === 'flex-end' ? 'flex-end' : 'center'};
    align-items: ${props => props.alignitems === 'left' ? 'left' : 'center'};
    flex-direction: ${props => props.flexdirection === 'row' ? 'row' : 'column'};
    padding: 1em;
    // max-height: 6rem;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    // border: 1px solid black;
    color: ${gb.colorGray39};
`

export const ImgTable = styled.img`
    padding: 0 1em;
    width: 100%;
    height: 6rem;
    // border: 1px solid black;
`

export const PTextPerNight = styled.p`
    color: ${gb.colorGreen};
`

export const IdTableH6 = styled.h6`
    text-align: left;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    white-space: nowrap;
    color: ${gb.colorGreen};
`

export const TextTableH6 = styled.h6`
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    white-space: nowrap;
    color: ${gb.colorGray39};
`