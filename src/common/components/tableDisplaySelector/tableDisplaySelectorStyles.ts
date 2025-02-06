
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.ts'


export const DisplayIndicator = styled.button<{ isSelected: boolean }>`
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

    ${({ isSelected }) => !isSelected && `
        &:hover {
            font-weight: 700;
            color: ${gb.colorBlueHoverFilterTableCustom};
            border-bottom: 2px solid ${gb.colorBlueHoverFilterTableCustom};
        }
    `}

    ${({ isSelected }) => isSelected && `
        font-weight: 700;
        border-bottom: 2px solid ${gb.colorBlack26};
    `}
        
`