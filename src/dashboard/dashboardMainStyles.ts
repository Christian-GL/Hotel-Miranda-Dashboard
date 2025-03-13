
import { styled } from 'styled-components'

import { MdOutlineBedroomParent } from "react-icons/md"
import { FaRegCalendarCheck } from "react-icons/fa"
import { IoLogInOutline } from "react-icons/io5"
import { IoLogOutOutline } from "react-icons/io5"

import * as globalConstStyles from '../common/styles/globalConstStyles.ts'


export const SectionPageDashboard = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    background-color: ${props => props.theme.backgroundPage};
`

export const SectionKPIs = styled.section`
    display: flex;
    padding: 1em 0;
`

export const IconBooking = styled(MdOutlineBedroomParent)`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
    width: 4rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${props => props.theme.iconDashboard};
    background-color: ${props => props.theme.iconBackgroundDashboard};
`

export const IconCalendar = styled(FaRegCalendarCheck)`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
    width: 4rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${props => props.theme.iconDashboard};
    background-color: ${props => props.theme.iconBackgroundDashboard};
`

export const IconLogIn = styled(IoLogInOutline)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.7em;
    width: 4.25rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${props => props.theme.iconDashboard};
    background-color: ${props => props.theme.iconBackgroundDashboard};
`

export const IconLogOut = styled(IoLogOutOutline)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.7em;
    width: 4.25rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${props => props.theme.iconDashboard};
    background-color: ${props => props.theme.iconBackgroundDashboard};
`

export const ArticleKPI = styled.article`
    flex: 1 1 0;
    text-align: left;
    margin: 0 1rem;
    padding: 1em;
    border-radius: 1rem;
    box-shadow: ${props => props.theme.boxShadowCustom};
    background-color: ${props => props.theme.backgroundKPIDashboard};

    &:hover {
        box-shadow: ${props => props.theme.boxShadowCustomWithHover};
        
        ${IconBooking}, ${IconCalendar}, ${IconLogIn}, ${IconLogOut} {
            color: ${props => props.theme.iconHoverDashboard};
            background-color: ${props => props.theme.iconHoverBackgroundDashboard};
        }
    }
    
`

export const DivCtnInfo = styled.div`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
`

export const NumberH4 = styled.h4`
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.5em;
    color: ${props => props.theme.titleKPIDashboard};
`

export const TextH5 = styled.h5`
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    color: ${props => props.theme.textKPIDashboard};
`

export const SectionReviews = styled.section`
    padding: 1em 0;
`

export const TitleSectionReviewsH5 = styled.h5`
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    color: ${props => props.theme.titleReviewsDashboard};
`

export const DivCtnReviews = styled.div`
    display: flex;
`