
import { BookingInterfaceId } from "booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "client/interfaces/clientInterface"
import { RoomInterfaceId } from "room/interfaces/roomInterface"


export interface BookingArchiveResponseInterface {
    booking: BookingInterfaceId | null,
    updatedRooms: RoomInterfaceId[],
    updatedClient: ClientInterfaceId | null
}