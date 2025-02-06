
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.ts'


export const ButtonCreateStyle = styled.button<{ fontSize?: string }>`
    padding: 1em 2em;
    font-family: ${gb.fontPoppins};
    font-size: ${props => props.fontSize || '0.75em'};
    font-weight: 400;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    color: ${gb.colorWhiteFull};
    background-color: ${gb.colorGrayIconHotel};
`