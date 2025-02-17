
import { styled } from 'styled-components'

import * as globalConstStyles from '../../styles/globalConstStyles.ts'


export const Main = styled.main<{ display?: string }>`
    transition: ${globalConstStyles.transitionSidebarMenu};
    padding-top: ${globalConstStyles.heightHeader};
    margin-left: ${props => props.display === 'collapsed' ? `${globalConstStyles.widthSidebarMenuCollapsed}` : `${globalConstStyles.widthSidebarMenuNotCollapsed}`};
    height: 100vh;
    background-color: ${props => props.theme.backgroundLayout};
`