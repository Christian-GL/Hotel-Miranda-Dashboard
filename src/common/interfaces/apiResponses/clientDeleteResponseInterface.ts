
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"


export interface ClientDeleteResponseInterface {
    clientDeleted: boolean
    clientId: string
    updatedBookings: BookingInterface[]
}