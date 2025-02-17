
import { styled } from 'styled-components'

import * as globalConstStyles from './globalConstStyles.ts'


export const DivCtnPagination = styled.div`
    text-align: right;
    margin-top: 2rem;
    padding: 1em;
    background-color: transparent;
`

export const ButtonSwitchPage = styled.button<{ margin?: string }>`
    margin: ${props => props.margin};
    padding: 1em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    color: ${props => props.theme.textButtonPagination};
    background-color: ${props => props.theme.backgroundButtonPagination};
`

export const SpanPageCount = styled.span`
    margin: 0 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font: weight: 400;
    color: ${props => props.theme.textPageCountPagination};
`