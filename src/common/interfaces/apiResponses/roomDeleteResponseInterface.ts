
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"


export interface RoomDeleteResponseInterface {
    roomDeleted: boolean
    roomId: string
    updatedBookings: BookingInterface[]
}