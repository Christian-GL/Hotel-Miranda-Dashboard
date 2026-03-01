
import React from 'react'

import { ButtonCreateStyle } from 'common/components/buttonCreate/buttonCreateStyles'
import { ButtonCreateInterface } from 'common/interfaces/buttonCreateInterface'


export const ButtonCreate: React.FC<ButtonCreateInterface> = ({
    onClick,
    children,
    padding,
    fontSize,
    isClickDisabled
}) => {

    return (
        <ButtonCreateStyle
            onClick={onClick}
            padding={padding}
            fontSize={fontSize}
            disabled={isClickDisabled}
        >
            {children}
        </ButtonCreateStyle>
    )
}