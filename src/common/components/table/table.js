
import { styled } from 'styled-components'

import { ImPhone } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";

import * as gb from '../../styles/globalVars.js'


export const Table = styled.table`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, auto);
    grid-template-columns: repeat(${props => props.columnlistlength}, auto);
    padding: 1em 2em;
    border-radius: 2.5rem;
    background-color: ${gb.colorWhiteFull};
`

export const TRTable = styled.tr`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 700;
    border-bottom: 1px solid ${gb.colorLightGray};
    color: ${gb.colorGray39};
`

export const PTable = styled.p`
    display: flex;
    justify-content: ${props => props.justifycontent === 'center' ? 'center' : 'flex-start'};
    align-items: ${props => props.alignitems === 'left' ? 'left' : 'center'};
    flex-direction: ${props => props.flexdirection === 'column' ? 'column' : 'row'};
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    border-bottom: 1px solid ${gb.colorLightGray};
    color: ${gb.colorGray39};
`

export const DivImgTable = styled.div`
    display: flex;
    align-items: center;
    padding: 1em;
    text-align: right;
    border-bottom: 1px solid ${gb.colorLightGray};
`

export const ImgTableRoom = styled.img`
    width: 100%;
    height: auto;
    min-width: 10rem;
    min-height: 7.5rem;
    max-width: 20rem;  
    max-height: 15rem;
`

export const ImgTableUser = styled.img`
    width: 100%;
    min-width: 4rem;
    max-width: 6rem;
    aspect-ratio: 1 / 1;
`

export const IconPhone = styled(ImPhone)`
    padding-right: 0.5em;
    width: 2rem;
    width: ${props => props.width};
    height: auto;
    color: ${gb.colorGray39};
    background-color: ${gb.colorWhiteFull};
`

export const PStatusRoomList = styled.p`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 1.25rem;
    color: ${gb.colorWhiteFull};
    // background-color: ${gb.colorGreen}       // <-- Sin condición si que deja (mismo problema 2 PStatus de debajo)
    background-color: ${props => props.status === true ? '#E23428' : '#5AD07A'};
`

export const PStatusAvailableUsers = styled.p`
    position: relative;
    padding: 1em 9em 1em 0;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.status === true ? '#5AD07A' : '#E23428'};
    background-color: ${gb.colorWhiteFull};
`

export const DivCtnAllOptions = styled.div`
    position: relative;
`

export const IconOptions = styled(SlOptionsVertical)`
    position: absolute;
    top: 50%;
    left: 7.55rem;
    // transform: translate(-50%, -50%);
    transform: translate(-50%, -80%);
    padding: 0.5em;
    width: 1.75rem;
    height: auto;
    cursor: pointer;
    color: ${gb.colorGray39};
    background-color: ${gb.colorWhiteFull};
`

export const DivCtnOptions = styled.div`
    display: ${props => props.display};
    flex-direction: column;
    gap: 0.5rem;
    position: absolute;
    // top: 1rem;
    // left: 3rem;
    transform: translate(32.5%, 15%);
    padding: 1em;
    font-family: ${gb.fontPoppins};
    border-radius: 0.5rem;
    background-color: ${gb.colorGrayBackgroundPage};
`

export const ButtonOption = styled.button`
    padding: 0.5em;
    width: 7.5rem;
    height: auto;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${gb.colorBlack26};
    background-color: ${gb.colorWhiteFull};
`

export const PStatusBooking = styled.p`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 0.75rem;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    color: ${props => props.color};
    background-color: ${props => props.backgroundcolor};
`

export const ButtonViewNotes = styled.button`
    padding: 1em 2em;
    font-family: ${gb.fontPoppins};
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${gb.colorBlack26};
    background-color: ${gb.colorGrayButtonTable};
`

export const ButtonPublishArchive = styled.button`
    margin-right: 1rem;
    padding: 0.5em;
    font-family: ${gb.fontPoppins};
    font-weight: 600; 
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.color};
    background-color: transparent;
`