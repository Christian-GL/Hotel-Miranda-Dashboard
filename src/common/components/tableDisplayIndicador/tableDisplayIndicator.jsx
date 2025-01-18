
import * as tableDisplayIndicatorJS from "./tableDisplayIndicator.js"


export const TableDisplayIndicator = (props) => {

    return (<>

        <tableDisplayIndicatorJS.DisplayIndicator>
            {props.text}
        </tableDisplayIndicatorJS.DisplayIndicator>

    </>)
}