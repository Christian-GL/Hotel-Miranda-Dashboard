
import { styled } from 'styled-components'

import { ImPhone } from "react-icons/im"
import { SlOptionsVertical } from "react-icons/sl"
import { GoTriangleUp } from "react-icons/go"
import { GoTriangleRight } from "react-icons/go"
import { GoTriangleDown } from "react-icons/go"

import * as gb from './globalVars.ts'
import { BookingStatus } from '../../booking/data/bookingStatus.ts'


export const Table = styled.table<{ rowlistlength: number, columnlistlength: number }>`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, auto);
    grid-template-columns: repeat(${props => props.columnlistlength}, auto);
    padding: 1em 2em;
    border-radius: 2.5rem;
    background-color: ${props => props.theme.backgroundTable};
`

export const THTable = styled.th<{ cursorPointer?: 'yes' | 'no' }>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 700;
    cursor: ${props => props.cursorPointer === 'yes' ? `pointer` : ``};
    border-bottom: 1px solid ${props => props.theme.borderTable};
    color: ${props => props.theme.textTable};
`

export const TriangleUp = styled(GoTriangleUp)`
    width: 2rem;
    height: auto;
    color: ${props => props.theme.iconTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const TriangleRight = styled(GoTriangleRight)`
    width: 2rem;
    height: auto;
    color: ${props => props.theme.iconTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const TriangleDown = styled(GoTriangleDown)`
    width: 2rem;
    height: auto;
    color: ${props => props.theme.iconTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const PTable = styled.p<{
    justifycontent?: string;
    alignitems?: string;
    flexdirection?: string;
}>`
    position: relative;
    display: flex;
    justify-content: ${props => props.justifycontent === 'center' ? 'center' : 'flex-start'};
    align-items: ${props => props.alignitems === 'left' ? 'left' : 'center'};
    flex-direction: ${props => props.flexdirection === 'column' ? 'column' : 'row'};
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme.borderTable};
    color: ${props => props.theme.textTable};
`

export const DivImgTable = styled.div`
    display: flex;
    align-items: center;
    padding: 1em;
    text-align: right;
    border-bottom: 1px solid ${props => props.theme.borderTable};
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

export const IconPhone = styled(ImPhone) <{ width?: string }>`
    padding-right: 0.5em;
    width: 2rem;
    width: ${props => props.width};
    height: auto;
    color: ${props => props.theme.iconTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const PStatusRoomList = styled.p<{ status: string }>`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 1.25rem;
    color: ${gb.colorWhiteFull};
    background-color: ${props => props.status === 'Available' ? props.theme.availableTable : props.theme.notAvailableTable};
`

export const PStatusAvailableUsers = styled.p<{ status: boolean }>`
    position: relative;
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.status === true ? props.theme.availableTable : props.theme.notAvailableTable};
    background-color: transparent;
`

export const IconOptions = styled(SlOptionsVertical)`
    padding: 0.5em;
    width: 1.75rem;
    height: auto;
    cursor: pointer;
    color: ${props => props.theme.iconOptionsTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const DivCtnOptions = styled.div<{ display: string, isInTable: boolean }>`
    z-index: 1;
    position: absolute;
    top: ${props => (props.isInTable ? '50%' : '30%')};
    left: ${props => (props.isInTable ? '0' : 'unset')};
    right: ${props => (props.isInTable ? 'unset' : '1%')};
    transform: ${props => (props.isInTable ? 'translate(-50%, 25%)' : 'unset')};
    display: ${props => props.display};
    flex-direction: column;
    gap: 0.5rem;
    padding: 1em;
    font-family: ${gb.fontPoppins};
    border-radius: 0.75rem;
    background-color: ${props => props.isInTable ? props.theme.containerOptionsTable : props.theme.containerOptionsNotInTable};

    &:hover {
        box-shadow: ${props => props.theme.boxShadowCustomWithHover};
    }
`

export const ButtonOption = styled.button`
    padding: 0.5em;
    width: 7.5rem;
    height: auto;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props => props.theme.iconTable};
    background-color: ${props => props.theme.iconBackgroundTable};

    &:hover {
        font-weight: 700;
    }
`

export const PStatusBooking = styled.p<{ status: BookingStatus }>`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 0.75rem;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    ${({ status, theme }) => {
        switch (status) {
            case BookingStatus.checkIn:
                return `
              color: ${theme.checkInTextTable};
              background-color: ${theme.checkInBackgroundTable};
            `
            case BookingStatus.inProgress:
                return `
              color: ${theme.inProgressTextTable};
              background-color: ${theme.inProgressBackgroundTable};
            `
            case BookingStatus.checkOut:
                return `
              color: ${theme.checkOutTextTable};
              background-color: ${theme.checkOutBackgroundTable};
            `
            default:
                return `
              color: gray;
              background-color: lightgray;
            `
        }
    }}
    `

export const ButtonView = styled.button`
    padding: 1em 2em;
    font-family: ${gb.fontPoppins};
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.theme.buttonTextTable};
    background-color: ${props => props.theme.buttonBackgroundTable};
`

export const ButtonPublishArchive = styled.button<{ archived: boolean }>`
    margin-right: 1rem;
    padding: 0.5em;
    font-family: ${gb.fontPoppins};
    font-weight: 600; 
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.archived ? props.theme.notAvailableTable : props.theme.availableTable};
    background-color: transparent;
`