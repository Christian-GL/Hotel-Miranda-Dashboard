
import { styled } from 'styled-components'

import { MdOutlineBedroomParent } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

import * as gb from '../../common/styles/globalVars.js'


export const SectionPageDashboard = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    border: 5px solid blue;
    background-color: ${gb.colorGrayBackgroundPage};
`

// KPIs
export const SectionKPIs = styled.section`
    display: flex;
    padding: 1em 0;
`

export const ArticleKPI = styled.article`
    flex: 1 1 0;
    text-align: left;
    margin: 0 1rem;
    padding: 1em;
    border-radius: 1rem;
    box-shadow: ${gb.boxShadowCustom};
    background-color: ${gb.colorWhiteFull};
`

export const IconBooking = styled(MdOutlineBedroomParent)`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
    width: 4rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${gb.colorRed};
    background-color: ${gb.colorLightRed};

    &:hover {
        color: ${gb.colorWhiteFull};
        background-color: ${gb.colorRed};
    }
`

export const IconCalendar = styled(FaRegCalendarCheck)`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
    width: 4rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${gb.colorRed};
    background-color: ${gb.colorLightRed};

    &:hover {
        color: ${gb.colorWhiteFull};
        background-color: ${gb.colorRed};
    }
`

export const IconLogIn = styled(IoLogInOutline)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.7em;
    width: 4.25rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${gb.colorRed};
    background-color: ${gb.colorLightRed};

    &:hover {
        color: ${gb.colorWhiteFull};
        background-color: ${gb.colorRed};
    }
`

export const IconLogOut = styled(IoLogOutOutline)`
    display: inline-block;
    vertical-align: middle;
    padding: 0.7em;
    width: 4.25rem;
    height: auto;
    border-radius: 0.6rem;
    color: ${gb.colorRed};
    background-color: ${gb.colorLightRed};

    &:hover {
        color: ${gb.colorWhiteFull};
        background-color: ${gb.colorRed};
    }
`

export const DivCtnInfo = styled.div`
    display: inline-block;
    vertical-align: middle;
    padding: 1em;
`

export const NumberH4 = styled.h4`
    font-family: ${gb.fontPoppins};
    font-size: 1.5em;
    color: ${gb.colorGray39}
`

export const TextH5 = styled.h5`
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    color: ${gb.colorGrayTextKPI};
`

// Reviews
export const SectionReviews = styled.section`
    padding: 1em 0;
`

export const TitleSectionReviewsH5 = styled.h5`
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    color: ${gb.colorGray39};
`

export const DivCtnReviews = styled.div`
    display: flex;
`