
import { BookingStatus } from "../../booking/enums/bookingStatus"


export interface BookingArticleInterface extends React.HTMLAttributes<HTMLElement> {
    bookingStatus: BookingStatus
    nameClient: string
    roomNumbersText: string
    orderDateText: string
    specialRequest: string
    navigationRoute: string
}