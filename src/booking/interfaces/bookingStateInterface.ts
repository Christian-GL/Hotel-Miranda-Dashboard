
import { BookingInterfaceId } from './bookingInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"
import { ApiErrorResponseInterface } from 'common/interfaces/apiResponses/apiErrorResponseInterface'

export interface BookingStateInterface {
    allData: BookingInterfaceId[]
    idData: BookingInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}