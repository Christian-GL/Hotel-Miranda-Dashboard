
import { UserInterfaceId } from "./userInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface UserStateInterface {
    allData: UserInterfaceId[]
    idData: UserInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}