
import { ApiStatus } from "common/enums/ApiStatus"
import { ApiErrorResponseInterface } from 'common/interfaces/apiResponses/apiErrorResponseInterface'
import { RoomInterfaceId } from 'room/interfaces/roomInterface'


export interface RoomStateInterface {
    allData: RoomInterfaceId[]
    idData: RoomInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    archiveStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}