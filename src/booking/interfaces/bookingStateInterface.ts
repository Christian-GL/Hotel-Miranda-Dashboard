
import { BookingInterfaceId } from './bookingInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface BookingStateInterface {
    allData: BookingInterfaceId[]
    idData: BookingInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}