
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"


export interface RoomDeleteResponseInterface {
    roomIsDeleted: boolean
    roomId: string
    updatedBookings: BookingInterfaceId[]
    updatedClients: ClientInterfaceId[]
}