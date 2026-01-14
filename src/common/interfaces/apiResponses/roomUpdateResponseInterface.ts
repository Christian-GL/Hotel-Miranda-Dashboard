
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"


export interface RoomUpdateResponseInterface {
    roomUpdated: RoomInterface | null
    updatedBookings: BookingInterface[]
}