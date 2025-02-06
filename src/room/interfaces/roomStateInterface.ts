
import { RoomInterface } from './roomInterface.ts'
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

export interface RoomStateInterface {
    allData: RoomInterface[]
    idData: RoomInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}