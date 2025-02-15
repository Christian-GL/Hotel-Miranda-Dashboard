
import React from 'react'

import { InputSearch, IconMagnifyingGlass } from './tableSearchTermStyles.ts'
import { TableSearchTermInterface } from './tableSearchTermInterface.ts'


export const TableSearchTerm: React.FC<TableSearchTermInterface> = (props) => {

    return (<>
        <IconMagnifyingGlass />
        <InputSearch onChange={props.onchange} placeholder={`${props.placeholder}`} />
    </>)
}