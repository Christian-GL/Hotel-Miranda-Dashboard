
import { styled } from 'styled-components'

// ICONS

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
    background-color: ${gb.colorGrayIconHotel};
`