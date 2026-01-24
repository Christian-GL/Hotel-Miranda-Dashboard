
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "client/interfaces/clientInterface"


export interface RoomUpdateResponseInterface {
    roomUpdated: RoomInterfaceId
    updatedBookings: BookingInterfaceId[]
    updatedClients: ClientInterfaceId[]
}