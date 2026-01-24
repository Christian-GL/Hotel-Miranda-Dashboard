
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"


export interface BookingCreateResponseInterface {
    booking: BookingInterfaceId
    updatedRooms: RoomInterfaceId[]
    updatedClient: ClientInterfaceId
}