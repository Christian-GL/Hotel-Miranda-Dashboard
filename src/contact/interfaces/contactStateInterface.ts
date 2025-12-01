
import { ContactInterface } from "./contactInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface ContactStateInterface {
    allData: ContactInterface[]
    notArchived: ContactInterface[]
    archived: ContactInterface[]
    idData: ContactInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}