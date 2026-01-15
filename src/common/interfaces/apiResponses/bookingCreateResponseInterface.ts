
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { ClientInterface } from "../../../client/interfaces/clientInterface"


export interface BookingCreateResponseInterface {
    booking: BookingInterface
    updatedRooms: RoomInterface[]
    updatedClient: ClientInterface
}