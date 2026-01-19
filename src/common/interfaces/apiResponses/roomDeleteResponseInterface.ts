
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { ClientInterface } from "../../../client/interfaces/clientInterface"


export interface RoomDeleteResponseInterface {
    roomDeleted: boolean
    roomId: string
    updatedBookings: BookingInterface[]
    updatedClients: ClientInterface[]
}