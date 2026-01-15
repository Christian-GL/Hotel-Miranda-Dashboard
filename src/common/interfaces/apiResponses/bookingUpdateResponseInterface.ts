
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { ClientInterface } from "../../../client/interfaces/clientInterface"


export interface BookingUpdateResponseInterface {
    booking: BookingInterface | null,
    updatedRooms: RoomInterface[],
    updatedClient: ClientInterface | null
}