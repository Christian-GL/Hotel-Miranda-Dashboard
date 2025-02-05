
import React from 'react'

import { InputSearchEmployee, IconMagnifyingGlass } from './tableSearchTerm.styles.tsx'
import { TableSearchTermInterface } from './tableSearchTerm.interface.ts'


export const TableSearchTerm: React.FC<TableSearchTermInterface> = (props) => {

    return (<>

        <IconMagnifyingGlass />
        <InputSearchEmployee onChange={props.onchange} placeholder={`${props.placeholder}`} />

    </>)
}