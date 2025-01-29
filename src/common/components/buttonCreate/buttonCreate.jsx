
import * as buttonCreateJS from "./buttonCreate.js"


export const ButtonCreate = ({ children, fontSize, onClick, ...rest }) => {

    return (<>

        <buttonCreateJS.ButtonCreate
            onClick={onClick}
            fontSize={fontSize}
            {...rest}
        >
            {children}
        </buttonCreateJS.ButtonCreate>

    </>)
}