
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { ClientInterface } from "client/interfaces/clientInterface"


export interface RoomUpdateResponseInterface {
    roomUpdated: RoomInterface
    updatedBookings: BookingInterface[]
    updatedClients: ClientInterface[]
}