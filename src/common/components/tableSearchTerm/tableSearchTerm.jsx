
import * as tableSearchTermJS from "./tableSearchTerm.js"


export const TableSearchTerm = (props) => {

    return (<>

        <tableSearchTermJS.IconMagnifyingGlass />
        <tableSearchTermJS.InputSearchEmployee onChange={props.onchange} placeholder={`${props.placeholder}`} />

    </>)
}