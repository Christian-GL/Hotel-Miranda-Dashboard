
import React from 'react'

import { ButtonCreateStyle } from './buttonCreateStyles'
import { ButtonCreateInterface } from '../../interfaces/buttonCreateInterface'


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({ onClick, children, padding, fontSize, disabledClick: disabledClick }) => {

    return (<>
        <ButtonCreateStyle onClick={onClick} padding={padding} fontSize={fontSize} disabledClick={disabledClick}  >
            {children}
        </ButtonCreateStyle>
    </>)
}