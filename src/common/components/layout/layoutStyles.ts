
import { styled } from 'styled-components'

import * as globalConstStyles from '../../styles/globalConstStyles'


export const Main = styled.main<{ isSidebarCollapsed?: boolean }>`
    transition: ${globalConstStyles.transitionSidebarMenu};
    padding-top: ${globalConstStyles.heightHeader};
    margin-left: ${props => props.isSidebarCollapsed ? `${globalConstStyles.widthSidebarMenuCollapsed}` : `${globalConstStyles.widthSidebarMenuNotCollapsed}`};
    height: 100vh;
    background-color: ${props => props.theme.backgroundLayout};
`