
import { UserStatus } from "../data/userStatus"

export interface UserInterface {
    _id: string
    photo: string
    full_name: string
    email: string
    start_date: string
    description: string
    phone_number: string
    status: UserStatus
    password: string
}