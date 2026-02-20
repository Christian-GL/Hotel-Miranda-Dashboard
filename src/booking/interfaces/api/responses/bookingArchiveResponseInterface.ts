
import { BookingInterfaceId } from "../../bookingInterface"
import { RoomInterfaceId } from "../../../../room/interfaces/roomInterface"
import { ClientInterfaceId } from "../../../../client/interfaces/clientInterface"


export interface BookingArchiveResponseInterface {
    booking: BookingInterfaceId | null,
    updatedRooms: RoomInterfaceId[],
    updatedClient: ClientInterfaceId | null
}