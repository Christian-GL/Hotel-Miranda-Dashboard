
import { ClientInterfaceId } from "./clientInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"

export interface ClientStateInterface {
    allData: ClientInterfaceId[]
    idData: ClientInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    apiError: ApiErrorResponseInterface | null
}