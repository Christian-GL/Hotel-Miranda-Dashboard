
import React from 'react'

import { DisplaySelector } from 'common/components/tableDisplaySelector/tableDisplaySelectorStyles'
import { TableDisplaySelectorInterface } from 'common/interfaces/tableDisplaySelectorInterface'


export const TableDisplaySelector: React.FC<TableDisplaySelectorInterface> = ({ text, onClick, isSelected }) => {

    return (<>

        <DisplaySelector onClick={onClick} isSelected={isSelected}>
            {text}
        </DisplaySelector>

    </>)
}