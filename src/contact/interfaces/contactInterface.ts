
import { ContactArchivedType } from '../enums/contactArchivedType'


export interface ContactInterfaceNoId {
    publish_date: string
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: ContactArchivedType
}

export interface ContactInterface extends ContactInterfaceNoId {
    _id: string
}