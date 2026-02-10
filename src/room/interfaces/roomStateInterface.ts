
import { RoomInterfaceId } from './roomInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"
import { ApiErrorResponseInterface } from 'common/interfaces/apiResponses/apiErrorResponseInterface'


export interface RoomStateInterface {
    allData: RoomInterfaceId[]
    idData: RoomInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}