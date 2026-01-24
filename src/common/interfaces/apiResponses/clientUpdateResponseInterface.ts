
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"


export interface ClientUpdateResponseInterface {
    clientUpdated: ClientInterfaceId
    updatedBookings: BookingInterfaceId[]
}
