
import * as sb from "./buttonStatus.js"


export const ButtonStatus = (props) => {

    const theme = "dark"

    return (<>

        {props.status === true ?
            <sb.ButtonStatus status={props.status}>Available</sb.ButtonStatus> :
            <sb.ButtonStatus status={props.status}>Booking</sb.ButtonStatus>
        }

    </>)
}