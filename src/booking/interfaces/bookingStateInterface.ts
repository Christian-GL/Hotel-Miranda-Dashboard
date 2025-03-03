
import { BookingInterfaceRoom } from './bookingInterface.ts'
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

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