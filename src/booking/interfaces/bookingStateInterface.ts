
import { BookingInterface } from './bookingInterface.ts'
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

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