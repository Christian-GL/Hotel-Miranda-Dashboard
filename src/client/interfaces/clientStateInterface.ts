
import { ClientInterfaceId } from "./clientInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface ClientStateInterface {
    allData: ClientInterfaceId[]
    idData: ClientInterfaceId
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}