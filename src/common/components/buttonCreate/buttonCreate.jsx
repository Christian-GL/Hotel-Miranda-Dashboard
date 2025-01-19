
import * as buttonCreateJS from "./buttonCreate.js"


export const ButtonCreate = (props) => {

    return (<>

        <buttonCreateJS.Sss onClick={props.onclick} fontsize={`${props.fontsize}`}>
            {props.text}
        </buttonCreateJS.Sss>

    </>)
}