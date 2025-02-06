
import { ContactInterface } from "./contactInterface.ts"
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

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