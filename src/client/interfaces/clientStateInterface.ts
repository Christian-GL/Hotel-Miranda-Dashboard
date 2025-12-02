
import { ClientInterface } from "./clientInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface ClientStateInterface {
    allData: ClientInterface[]
    notArchived: ClientInterface[]
    archived: ClientInterface[]
    idData: ClientInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}