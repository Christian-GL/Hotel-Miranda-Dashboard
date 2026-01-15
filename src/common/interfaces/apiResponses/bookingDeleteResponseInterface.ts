
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { ClientInterface } from "../../../client/interfaces/clientInterface"


export interface BookingDeleteResponseInterface {
    deleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterface[],
    updatedClient: ClientInterface | null
}