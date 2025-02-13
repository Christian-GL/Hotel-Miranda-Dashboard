
import React from 'react'

import { ButtonCreateStyle } from './buttonCreateStyles.ts'
import { ButtonCreateInterface } from './buttonCreateInterface.ts'


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({ onClick, children, padding, fontSize }) => {

    return (<>

        <ButtonCreateStyle
            onClick={onClick}
            padding={padding}
            fontSize={fontSize}
        >
            {children}
        </ButtonCreateStyle>

    </>)
}