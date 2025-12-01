
import { styled } from 'styled-components'

import * as globalConstStyles from '../../styles/globalConstStyles'


export const ButtonCreateStyle = styled.button<{ padding?: string, fontSize?: string }>`
    padding: ${props => props.padding || '1em 2em'};
    font-family: ${globalConstStyles.fontPoppins};
    font-size: ${props => props.fontSize || '0.75em'};
    font-weight: 400;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    color: ${props => props.theme.textButtonCreate};
    background-color: ${props => props.theme.backgroundButtonCreate};
`