
import { styled } from 'styled-components'

import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

import * as gb from '../../styles/globalVars.js'


export const ArticleReview = styled.article`
    flex: 1 1 0;
    text-align: center;
    margin: 1rem;
    padding: 1em;
    min-width: 18.5rem;
    border-radius: 1rem;
    box-shadow: ${gb.boxShadowCustom};
    background-color: ${gb.colorWhiteFull};

    &:hover {
        box-shadow: ${gb.boxShadowCustomWithHover};
    }
`

export const PTextReview = styled.p`
    text-align: left;
    width: 100%;
    height: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    line-height: 1.6rem;
    color: ${gb.colorGrayTextReview};
`

export const DivCtnDetails = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    margin-top: 2rem;
    text-align: left;
`

export const DivCtnReviewDetails = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

export const ImgProfile = styled.img`
    display: inline-block;
    vertical-align: middle;
    width: 5rem;
    height: 5rem;
    min-width: 5rem;
    min-height: 5rem;
    border-radius: 0.5rem;
`

export const DivCtnInfoDetails = styled.div`
    display: inline-block;
    vertical-align: middle;
    padding-left: 1em;
    flex-wrap: nowrap;
`

export const TextH5 = styled.h5`
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    color: ${gb.colorGrayTextKPI};
`

export const TitleNameProfile = styled.h6`
    display: inline-block;
    vertical-align: middle;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    color: ${gb.colorBlack26};
`

export const DivCtnIcons = styled.div`
    display: flex;
    align-items: center;
    margin-top: 2.5rem;
    padding-left: 1em;
`

export const IconCheckConfirm = styled(FaRegCheckCircle)`
    margin-right: 0.25rem;
    width: 1.85rem;
    height: auto;
    cursor: pointer;
    color: ${gb.colorGreen};
    background-color: ${gb.colorWhiteFull};
`

export const IconCheckCross = styled(RxCrossCircled)`
    width: 2rem;
    height: auto;
    cursor: pointer;
    color: ${gb.colorRed};
    background-color: ${gb.colorWhiteFull};
`