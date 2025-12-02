
import { OptionYesNo } from 'common/enums/optionYesNo'


export interface ClientInterfaceNoId {
    full_name: string
    email: string
    phone_number: string
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface ClientInterface extends ClientInterfaceNoId {
    _id: string
}