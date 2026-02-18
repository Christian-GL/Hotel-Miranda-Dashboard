
import { BookingInterfaceId } from "../../../../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "../../../../client/interfaces/clientInterface"


export interface ClientArchiveResponseInterface {
    clientUpdated: ClientInterfaceId
    updatedBookings: BookingInterfaceId[]
}