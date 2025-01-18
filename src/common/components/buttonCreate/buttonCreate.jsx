
import * as buttonCreateJS from "./buttonCreate.js"


export const ButtonCreate = (props) => {

    return (<>

        <buttonCreateJS.Sss fontsize={`${props.fontsize}`}>
            {props.text}
        </buttonCreateJS.Sss>

    </>)
}