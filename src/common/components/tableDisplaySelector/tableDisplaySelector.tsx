
import React from 'react'

import { DisplaySelector } from './tableDisplaySelectorStyles.ts'
import { TableDisplaySelectorInterface } from './tableDisplaySelectorInterface.ts'


export const TableDisplaySelector: React.FC<TableDisplaySelectorInterface> = ({ text, onClick, isSelected }) => {

    return (<>

        <DisplaySelector onClick={onClick} isSelected={isSelected}>
            {text}
        </DisplaySelector>

    </>)
}