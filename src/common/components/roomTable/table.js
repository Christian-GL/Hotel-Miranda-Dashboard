
import { styled } from 'styled-components'

// ICONS

import * as gb from '../../styles/globalVars.js'


export const sss = styled.p`
    font-family: ${gb.fontPoppins};
`

export const Table = styled.ul`
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-template-columns: repeat(${props => props.columnList.length}, 1fr);
    


    // align-items: ${props => props.display === 'collapsed' ? 'center' : 'left'};;
    // justify-content: ${props => props.display === 'collapsed' ? 'flex-start' : 'space-between'};
    // padding: ${props => props.display === 'collapsed' ? '1em' : '1em 2.5em'};
    // width: ${props => props.display === 'collapsed' ? '5rem' : '18rem'};
    // height: 100vh;
    // text-align: left;
    // transition: 0.5s ease;
    // background: ${gb.colorWhiteFull};
    // border: 1px solid black;
`