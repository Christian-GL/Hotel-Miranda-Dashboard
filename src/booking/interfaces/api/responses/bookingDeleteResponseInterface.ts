
import { ClientInterfaceId } from "client/interfaces/clientInterface"
import { RoomInterfaceId } from "room/interfaces/roomInterface"


export interface BookingDeleteResponseInterface {
    bookingIsDeleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterfaceId[],
    updatedClient: ClientInterfaceId | null
}