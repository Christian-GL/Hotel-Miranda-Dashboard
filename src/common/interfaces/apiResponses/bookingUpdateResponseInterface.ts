
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"


export interface BookingUpdateResponseInterface {
    booking: BookingInterfaceId | null,
    updatedRooms: RoomInterfaceId[],
    updatedClient: ClientInterfaceId | null
}