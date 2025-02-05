
import { UserInterface } from "./userInterface.ts"
import { ApiStatus } from "../../common/enums/ApiStatus.ts"

export interface UserStateInterface {
    allData: UserInterface[]
    idData: UserInterface | null
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}