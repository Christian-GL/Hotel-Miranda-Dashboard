
import React from 'react'

import { IconMagnifyingGlass, InputSearch } from 'common/components/tableSearchTerm/tableSearchTermStyles'
import { TableSearchTermInterface } from 'common/interfaces/tableSearchTermInterface'


export const TableSearchTerm: React.FC<TableSearchTermInterface> = (props) => {

    return (<>
        <IconMagnifyingGlass />
        <InputSearch onChange={props.onchange} placeholder={`${props.placeholder}`} />
    </>)
}