
import { BookingInterfaceData } from './bookingInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface BookingStateInterface {
    allData: BookingInterfaceData[]
    idData: BookingInterfaceData
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}