
import { BookingInterface } from './bookingInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface BookingStateInterface {
    allData: BookingInterface[]
    idData: BookingInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}