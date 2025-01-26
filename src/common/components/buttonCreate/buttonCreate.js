
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.js'


export const ButtonCreate = styled.button`
    padding: 1em 2em;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-size: ${props => props.fontsize};
    font-weight: 400;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    color: ${gb.colorWhiteFull};
    color: ${props => props.color};
    background-color: ${gb.colorGrayIconHotel};
    background-color: ${props => props.backgroundcolor};
`