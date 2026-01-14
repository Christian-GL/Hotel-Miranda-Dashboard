
import { RoomInterface } from './roomInterface'
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface RoomStateInterface {
    allData: RoomInterface[]
    idData: RoomInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}