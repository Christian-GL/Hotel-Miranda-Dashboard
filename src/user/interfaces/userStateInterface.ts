
import { UserInterfaceId } from "./userInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"

export interface UserStateInterface {
    allData: UserInterfaceId[]
    idData: UserInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}