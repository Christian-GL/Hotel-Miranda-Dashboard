
import { OptionYesNo } from 'common/enums/optionYesNo'


export interface ClientInterface {
    full_name: string
    email: string
    phone_number: string
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface ClientInterfaceId extends ClientInterface {
    _id: string
}