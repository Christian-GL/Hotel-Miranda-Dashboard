
import { RoomInterfaceId } from "../../../../room/interfaces/roomInterface"
import { BookingInterfaceId } from "../../../../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "client/interfaces/clientInterface"


export interface RoomArchiveResponseInterface {
    roomUpdated: RoomInterfaceId
    updatedBookings: BookingInterfaceId[]
    updatedClients: ClientInterfaceId[]
}