
import { BookingInterfaceId } from "../../../../booking/interfaces/bookingInterface"


export interface ClientDeleteResponseInterface {
    clientIsDeleted: boolean
    clientId: string
    updatedBookings: BookingInterfaceId[]
}