
import { UserStatus } from "../data/userStatus"

export interface UserInterfaceNoId {
    photo: string
    full_name: string
    email: string
    start_date: string
    description: string
    phone_number: string
    status: UserStatus
    password: string
}

export interface UserInterface extends UserInterfaceNoId {
    _id: number
}