
import React from 'react'

import { DisplaySelector } from './tableDisplaySelectorStyles'
import { TableDisplaySelectorInterface } from '../../interfaces/tableDisplaySelectorInterface'


export const TableDisplaySelector: React.FC<TableDisplaySelectorInterface> = ({ text, onClick, isSelected }) => {

    return (<>

        <DisplaySelector onClick={onClick} isSelected={isSelected}>
            {text}
        </DisplaySelector>

    </>)
}