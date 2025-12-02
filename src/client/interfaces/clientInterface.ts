
import { ClientArchivedType } from '../enums/clientArchivedType'


export interface ClientInterfaceNoId {
    publish_date: string
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: ClientArchivedType
}

export interface ClientInterface extends ClientInterfaceNoId {
    _id: string
}