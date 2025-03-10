
import { ContactArchived } from '../enums/contactArchived.ts'


export interface ContactInterfaceNoId {
    publish_date: string
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: ContactArchived
}

export interface ContactInterface extends ContactInterfaceNoId {
    _id: number
}