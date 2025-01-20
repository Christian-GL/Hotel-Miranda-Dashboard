
import * as tableDisplayIndicatorJS from "./tableDisplaySelector.js"


export const TableDisplayIndicator = (props) => {

    return (<>

        <tableDisplayIndicatorJS.DisplayIndicator>
            {props.text}
        </tableDisplayIndicatorJS.DisplayIndicator>

    </>)
}