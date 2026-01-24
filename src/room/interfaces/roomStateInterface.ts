
import { RoomInterfaceId } from './roomInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface RoomStateInterface {
    allData: RoomInterfaceId[]
    idData: RoomInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}