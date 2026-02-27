
import { ApiStatus } from "common/enums/ApiStatus"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { UserInterfaceId } from "user/interfaces/userInterface"

export interface UserStateInterface {
    allData: UserInterfaceId[]
    idData: UserInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    archiveStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}