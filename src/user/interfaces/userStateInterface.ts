
import { UserInterface } from "./userInterface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface UserStateInterface {
    allData: UserInterface[]
    idData: UserInterface
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    errorMessage: string | null
}