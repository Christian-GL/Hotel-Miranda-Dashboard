
import { RoomInterfaceBookings } from './roomInterface.ts'
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

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