
import { styled } from 'styled-components'

import { ImPhone } from "react-icons/im"
import { SlOptionsVertical } from "react-icons/sl"
import { GoTriangleUp } from "react-icons/go"
import { GoTriangleRight } from "react-icons/go"
import { GoTriangleDown } from "react-icons/go"

import * as globalConstStyles from './globalConstStyles'
import { BookingStatus } from '../../booking/enums/bookingStatus'


export const EmptyTableMessage = styled.p`
    padding: 1.5em 2em;
    width: 100%;
    text-align: center;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    border-radius: 2.5rem;
    color: ${props => props.theme.textTable};
    background-color: ${props => props.theme.backgroundTable};
`

export const Table = styled.table<{ rowlistlength: number, columnlistlength: number }>`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, auto);
    grid-template-columns: repeat(${props => props.columnlistlength}, auto);
    padding: 1em 2em;
    width: min-content;
    min-width: 100%;
    border-radius: 2.5rem;
    background-color: ${props => props.theme.backgroundTable};
`

export const TitleColumn = styled.th<{ isCursorPointer?: boolean }>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 700;
    cursor: ${props => props.isCursorPointer ? 'pointer' : 'auto'};
    border-bottom: 1px solid ${props => props.theme.borderTable};
    color: ${props => props.theme.textTable};
`

export const CtnCell = styled.div<{ justifycontent?: string; alignitems?: string; flexdirection?: string }>`
    display: flex;
    justify-content: ${props => props.justifycontent || 'flex-start'};
    align-items: ${props => props.alignitems || 'center'};
    flex-direction: ${props => props.flexdirection || 'row'};
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 500;
    border-bottom: 1px solid ${props => props.theme.borderTable};
    color: ${props => props.theme.textTable};
`

export const TextCell = styled.p<{ fontSize?: string, minWidth?: string, isName?: boolean, isTextBreakable?: boolean }>`
    min-width: ${props => props.minWidth || 'auto'};;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: ${props => props.fontSize || 'auto'};
    font-weight: ${props => props.isName ? '700' : '500'};
    white-space: ${props => props.isTextBreakable ? 'normal' : 'nowrap'};
    color: ${props => props.isName ? props.theme.nameTable : props.theme.textTable};
`

export const TextId = styled.p`
    min-width: 4.25rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 700;
    overflow-wrap: break-word;
    word-break: break-word;
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

export const ImgRoom = styled.img`
    width: 100%;
    min-width: 12.5rem;
    max-width: 17.5rem;
    border-radius: 5%;
    aspect-ratio: 1.5 / 1;
`

export const ImgUser = styled.img`
    width: 100%;
    min-width: 5rem;
    max-width: 7.5rem;
    border-radius: 5%;
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

export const TextStatusRoomList = styled.p<{ status: string }>`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 1.25rem;
    color: ${props => props.theme.textTable2};
    background-color: ${props => props.status === 'Available' ? props.theme.availableTable : props.theme.notAvailableTable};
`

export const TextStatusAvailableUsers = styled.p<{ active: boolean }>`
    position: relative;
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.active === true ? props.theme.availableTable : props.theme.notAvailableTable};
    background-color: transparent;
`

export const CtnMenuOptions = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

export const IconOptions = styled(SlOptionsVertical)`
    padding: 0.5em;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    cursor: pointer;
    color: ${props => props.theme.iconOptionsTable};
    background-color: ${props => props.theme.iconBackgroundTable};
`

export const CtnOptions = styled.div<{ display: string, isInTable: boolean }>`
    z-index: 1;
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    display: ${props => props.display};
    flex-direction: column;
    gap: 0.5rem;
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    border-radius: 0.75rem;
    background-color: ${props => props.isInTable ? props.theme.containerOptionsTable : props.theme.containerOptionsNotInTable};

    &:hover {
        box-shadow: ${props => props.theme.boxShadowCustomWithHover};
    }
`

export const ButtonOption = styled.button<{ disabledClick?: boolean }>`
    padding: 0.5em;
    width: 7.5rem;
    height: auto;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    color: ${props =>
        props.disabledClick
            ? props.theme.buttonOptionTextDisabled
            : props.theme.buttonOptionText};
    background-color: ${props =>
        props.disabledClick
            ? props.theme.buttonOptionBackgroundDisabled
            : props.theme.buttonOptionBackground};

    &:hover {
        font-weight: 700;
    }
`

export const TotalBookingStatus = styled.p<{ status: BookingStatus }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.25em;
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
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.theme.buttonTextTable};
    background-color: ${props => props.theme.buttonBackgroundTable};
`

export const ButtonPublishArchive = styled.button<{ archived: boolean }>`
    margin-right: 1rem;
    padding: 0.5em;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 600; 
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.archived ? props.theme.notAvailableTable : props.theme.availableTable};
    background-color: transparent;
`