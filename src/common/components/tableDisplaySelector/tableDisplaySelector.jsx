
import * as tableDisplayIndicatorJS from "./tableDisplaySelector.js"


export const TableDisplayIndicator = ({text, onClick, isSelected}) => {

    return (<>

        <tableDisplayIndicatorJS.DisplayIndicator onClick={onClick} isSelected={isSelected}>
            {text}
        </tableDisplayIndicatorJS.DisplayIndicator>

    </>)
}