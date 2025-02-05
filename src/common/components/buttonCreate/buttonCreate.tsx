
import React from 'react'

import { ButtonCreateStyle } from './buttonCreate.styles.tsx'
import { ButtonCreateInterface } from "./buttonCreate.inferface.ts"


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({ children, fontSize, onClick, ...rest }) => {

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