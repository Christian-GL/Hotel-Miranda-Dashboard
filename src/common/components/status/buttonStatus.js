
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.js'


export const ButtonStatus = styled.ul`
    display: grid;
    grid-template-rows: repeat(${props => props.rowlistlength}, 1fr);
    grid-template-columns: repeat(${props => props.columnlistlength}, 1fr);
    // grid-auto-flow: column;
    list-style: none;
`