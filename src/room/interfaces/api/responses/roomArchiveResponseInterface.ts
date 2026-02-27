
import { BookingInterfaceId } from "booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "client/interfaces/clientInterface"
import { RoomInterfaceId } from "room/interfaces/roomInterface"


export interface RoomArchiveResponseInterface {
    roomUpdated: RoomInterfaceId
    updatedBookings: BookingInterfaceId[]
    updatedClients: ClientInterfaceId[]
}