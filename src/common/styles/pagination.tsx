
import { styled } from 'styled-components'

import * as gb from './globalVars.js'


export const DivCtnPagination = styled.div`
    text-align: right;
    margin-top: 2rem;
    padding: 1em;
    background-color: ${gb.colorGrayBackgroundPage};
`

export const ButtonSwitchPage = styled.button<{ margin?: string }>`
    margin: ${props => props.margin};
    padding: 1em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    color: ${gb.colorWhiteFull};
    background-color: ${gb.colorGrayIconHotel};
`

export const SpanPageCount = styled.span`
    margin: 0 1rem;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    font: weight: 400;
    color: ${gb.colorBlack26};
`