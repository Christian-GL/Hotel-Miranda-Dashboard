
import { JobPosition } from "../enums/jobPosition"
import  { Role } from "../enums/role"
import { OptionYesNo } from "../../common/enums/optionYesNo"
// import { UserStatus } from "../enums/userStatus"

// OLD VERSION:
// export interface UserInterfaceNoId {
//     photo: string
//     full_name: string
//     email: string
//     start_date: string
//     description: string
//     phone_number: string
//     status: UserStatus
//     password: string
// }

// export interface UserInterface extends UserInterfaceNoId {
//     _id: string
// }

export interface UserInterfaceNoId {
    photo: string | null
    full_name: string
    email: string
    phone_number: string
    start_date: Date
    end_date: Date
    job_position: JobPosition
    role: Role
    password: string,
    isArchived: OptionYesNo
}

export interface UserInterface extends UserInterfaceNoId {
    _id: string
}