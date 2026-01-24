
import { JobPosition } from "../enums/jobPosition"
import { Role } from "../enums/role"
import { OptionYesNo } from "../../common/enums/optionYesNo"


export interface UserInterface {
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

export interface UserInterfaceId extends UserInterface {
    _id: string
}
