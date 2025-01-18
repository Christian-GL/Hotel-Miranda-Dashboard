
import { styled } from 'styled-components'

// ICONS

import * as gb from '../../styles/globalVars.js'


export const DisplayIndicator = styled.button`
    flex: 1 1 0;
    padding: 1em;
    text-align: center;
    font-family: ${gb.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border: none;
    border-bottom: 2px solid ${gb.colorLightGray};
    cursor: pointer;
    background-color: ${gb.colorGrayBackgroundPage};

    &:hover {
        font-weight: 700;
        border-bottom: 2px solid ${gb.colorBlack26};
    }
`