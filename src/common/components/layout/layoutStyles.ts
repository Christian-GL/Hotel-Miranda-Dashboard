
import { styled } from 'styled-components'

import * as gb from '../../styles/globalVars.ts'


export const Main = styled.main<{ display?: string }>`
    transition: ${gb.transitionSidebarMenu};
    padding-top: ${gb.heightHeader};
    margin-left: ${props => props.display === 'collapsed' ? `${gb.widthSidebarMenuCollapsed}` : `${gb.widthSidebarMenuNotCollapsed}`};
    height: 100vh;
`