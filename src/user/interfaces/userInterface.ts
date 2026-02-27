
import { OptionYesNo } from "common/enums/optionYesNo"
import { JobPosition } from "user/enums/jobPosition"
import { Role } from "user/enums/role"


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
