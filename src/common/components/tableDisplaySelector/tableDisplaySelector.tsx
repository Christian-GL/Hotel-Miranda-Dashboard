
import React from 'react'

import { DisplayIndicator } from './tableDisplaySelectorStyles.ts'
import { TableDisplaySelectorInterface } from './tableDisplaySelectorInterface.ts'


// CAMBIAR NOMBRE DE INDICATOR a SELECTOR !!!!!!!!!!!!!
export const TableDisplayIndicator: React.FC<TableDisplaySelectorInterface> = ({ text, onClick, isSelected }) => {

    return (<>

        <DisplayIndicator onClick={onClick} isSelected={isSelected}>
            {text}
        </DisplayIndicator>

    </>)
}