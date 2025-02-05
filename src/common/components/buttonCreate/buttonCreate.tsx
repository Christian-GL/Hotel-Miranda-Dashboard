
import React from 'react'

import { ButtonCreateStyle } from './buttonCreateStyles.ts'
import { ButtonCreateInterface } from './buttonCreateInterface.ts'


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({ onClick, children, fontSize }) => {

    return (<>

        <ButtonCreateStyle
            onClick={onClick}
            fontSize={fontSize}
        >
            {children}
        </ButtonCreateStyle>

    </>)
}