
import { BookingInterfaceId } from "booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "client/interfaces/clientInterface"
import { RoomInterfaceId } from "room/interfaces/roomInterface"


export interface BookingCreateResponseInterface {
    booking: BookingInterfaceId
    updatedRooms: RoomInterfaceId[]
    updatedClient: ClientInterfaceId
}