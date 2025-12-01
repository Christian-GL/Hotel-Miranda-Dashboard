
import { RoomInterfaceBookings } from './roomInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface RoomStateInterface {
    allData: RoomInterfaceBookings[]
    idData: RoomInterfaceBookings
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}