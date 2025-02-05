
import React from 'react'

import { DisplayIndicator } from './tableDisplaySelector.styles.tsx'
import { TableDisplaySelectorInterface } from './tableDisplaySelector.interface.ts'


// CAMBIAR NOMBRE DE INDICATOR a SELECTOR !!!!!!!!!!!!!
export const TableDisplayIndicator: React.FC<TableDisplaySelectorInterface> = ({ text, onClick, isSelected }) => {

    return (<>

        <DisplayIndicator onClick={onClick} isSelected={isSelected}>
            {text}
        </DisplayIndicator>

    </>)
}