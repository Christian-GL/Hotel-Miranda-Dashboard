
import * as tableSearchTermJS from "./tableSearchTerm.js"


export const TableSearchTerm = (props) => {

    return (<>

        <tableSearchTermJS.IconMagnifyingGlass />
        <tableSearchTermJS.InputSearchEmployee placeholder={`${props.placeholder}`} />

    </>)
}