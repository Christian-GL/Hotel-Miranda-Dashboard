
export interface ContactInterfaceWithOutID {
    publish_date: string
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: boolean
}

export interface ContactInterface extends ContactInterfaceWithOutID {
    _id: string
}