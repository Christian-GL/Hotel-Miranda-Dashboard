
import React from 'react'

import { InputSearchEmployee, IconMagnifyingGlass } from './tableSearchTermStyles.ts'
import { TableSearchTermInterface } from './tableSearchTermInterface.ts'


export const TableSearchTerm: React.FC<TableSearchTermInterface> = (props) => {

    return (<>

        <IconMagnifyingGlass />
        <InputSearchEmployee onChange={props.onchange} placeholder={`${props.placeholder}`} />

    </>)
}