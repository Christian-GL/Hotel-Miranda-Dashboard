
import { UserInterface } from "./user.interface"
import { ApiStatus } from "../../common/enums/ApiStatus"

export interface UserState {
    allData: UserInterface[]
    idData: UserInterface | null
    allStatus: ApiStatus
    idStatus: ApiStatus
    createStatus: ApiStatus
    updateStatus: ApiStatus
    deleteStatus: ApiStatus
    error: boolean
}