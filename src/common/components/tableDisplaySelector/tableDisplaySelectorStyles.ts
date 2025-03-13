
import { styled } from 'styled-components'

import * as globalConstStyles from '../../styles/globalConstStyles.ts'


export const DisplaySelector = styled.button<{ isSelected: boolean }>`
    flex: 1 1 0;
    padding: 1em;
    text-align: center;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 0.75em;
    font-weight: 400;
    border: none;
    border-bottom: 2px solid lightgray;
    cursor: pointer;
    color: ${props => props.theme.textDisplaySelector};
    background-color: transparent;

    ${({ isSelected, theme }) => isSelected ?
        `
        font-weight: 700;
        color: ${theme.selectedDisplaySelector};
        border-bottom: 2px solid ${theme.selectedDisplaySelector};
    ` : `
        &:hover {
            font-weight: 700;
            color: ${theme.hoverDisplaySelector};
            border-bottom: 2px solid ${theme.hoverBorderDisplaySelector};
        }
    `
    }
        
`