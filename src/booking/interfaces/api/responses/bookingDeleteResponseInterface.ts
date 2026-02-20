
import { RoomInterfaceId } from "../../../../room/interfaces/roomInterface"
import { ClientInterfaceId } from "../../../../client/interfaces/clientInterface"


export interface BookingDeleteResponseInterface {
    bookingIsDeleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterfaceId[],
    updatedClient: ClientInterfaceId | null
}