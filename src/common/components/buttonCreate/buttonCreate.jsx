
import * as buttonCreateJS from "./buttonCreate.js"


export const ButtonCreate = (props) => {

    return (<>

        <buttonCreateJS.ButtonCreate onClick={props.onclick} fontsize={`${props.fontsize}`}>
            {props.text}
        </buttonCreateJS.ButtonCreate>

    </>)
}