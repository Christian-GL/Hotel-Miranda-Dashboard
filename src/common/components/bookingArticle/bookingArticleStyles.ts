
import { styled } from 'styled-components'

import * as globalConstStyles from '../../styles/globalConstStyles'
import { BookingStatus } from '../../../booking/enums/bookingStatus'


export const BookingArticle = styled.article`
    flex: 1 1 0;
    text-align: center;
    margin: 1rem;
    padding: 1.25em;
    min-width: 25rem;
    border-radius: 1rem;
    box-shadow: ${props => props.theme.boxShadowCustom};
    background-color: ${props => props.theme.backgroundBookingArticle};

    &:hover {
        box-shadow: ${props => props.theme.boxShadowCustomWithHover};
    }
`

export const TextCheckingStatus = styled.p<{ status: BookingStatus }>`
    text-align: left;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.5em;
    cursor: pointer;
    color: ${props => props.theme.specialRequestBookingArticle};

    ${({ status, theme }) => {
        switch (status) {
            case BookingStatus.checkIn:
                return `
                  color: ${theme.checkInBookingArticle};
                `
            case BookingStatus.inProgress:
                return `
                  color: ${theme.inProgressBookingArticle};
                `
            case BookingStatus.checkOut:
                return `
                  color: ${theme.checkOutBookingArticle};
                `
            default:
                return `
                  color: gray;
                `
        }
    }}
`

export const TextSpecialRequest = styled.p`
    margin-top: 1rem;
    text-align: left;
    width: 100%;
    height: 7.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;          // Línea en la cual se añadirán puntos suspensivos en caso de ser necesarios.
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    line-height: 1.6rem;
    cursor: pointer;
    color: ${props => props.theme.specialRequestBookingArticle};
`

export const CtnDetails = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    margin-top: 2rem;
    text-align: left;
`

export const CtnLeft = styled.div`
    display: flex;
    align-items: center;
`

export const ImgHotel = styled.img`
    display: inline-block;
    vertical-align: middle;
    width: 5rem;
    height: 5rem;
    min-width: 5rem;
    min-height: 5rem;
    border-radius: 0.5rem;
`

export const CtnInfo = styled.div`
    display: inline-block;
    vertical-align: middle;
    padding-left: 1em;
    flex-wrap: nowrap;
`

export const TitleNameClient = styled.h6`
    display: inline-block;
    vertical-align: middle;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    white-space: nowrap;
    color: ${props => props.theme.nameClientBookingArticle};
`

export const TitleDate = styled.h5`
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.85em;
    font-weight: 400;
    white-space: nowrap;
    color: ${props => props.theme.specialRequestBookingArticle};
`

export const CtnRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ButtonNavigation = styled.button`
    width: 4rem;
    height: 4rem;
    font-weight: 700;
    font-family: ${globalConstStyles.fontPoppins};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: ${props => props.theme.buttonBookingArticle};
    background-color: ${props => props.theme.buttonBackgroundBookingArticle};

    &:hover {
        transition: 0.25s;
        transform: scale(1.1);
    }
`