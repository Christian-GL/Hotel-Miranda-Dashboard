
import React from 'react'

import { InputSearch, IconMagnifyingGlass } from './tableSearchTermStyles'
import { TableSearchTermInterface } from '../../interfaces/tableSearchTermInterface'


export const TableSearchTerm: React.FC<TableSearchTermInterface> = (props) => {

    return (<>
        <IconMagnifyingGlass />
        <InputSearch onChange={props.onchange} placeholder={`${props.placeholder}`} />
    </>)
}