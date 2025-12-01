
import { BookingInterfaceRoom } from './bookingInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface BookingStateInterface {
    allData: BookingInterfaceRoom[]
    idData: BookingInterfaceRoom
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}