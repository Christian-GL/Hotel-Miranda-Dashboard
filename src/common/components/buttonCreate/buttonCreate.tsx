
import React from 'react'

import { ButtonCreateStyle } from './buttonCreateStyles.ts'
import { ButtonCreateInterface } from './buttonCreateInterface.ts'


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({ onClick, children, fontSize, ...rest }) => {

    return (<>

        <ButtonCreateStyle
            onClick={onClick}
            fontSize={fontSize}
            {...rest}
        >
            {children}
        </ButtonCreateStyle>

    </>)
}