
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { ClientInterface } from "../../../client/interfaces/clientInterface"


export interface ClientUpdateResponseInterface {
    clientUpdated: ClientInterface
    updatedBookings: BookingInterface[]
}
