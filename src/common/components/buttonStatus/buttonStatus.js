
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.js'


export const ButtonStatus = styled.ul`
    padding: 1em 0;
    text-align: center;
    width: 6.5rem;
    border-radius: 1.25rem;
    color: ${gb.colorWhiteFull};
    // background-color: ${gb.colorGreen}       // <-- Sin condición si que deja
    background-color: ${props => props.status === true ? '#E23428' : '#5AD07A'};
`