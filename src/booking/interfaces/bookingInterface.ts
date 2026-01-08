
import { OptionYesNo } from 'common/enums/optionYesNo'


export interface BookingInterfaceCheckInOut {
    check_in_date: Date
    check_out_date: Date
}

export interface BookingInterfaceCheckInOutId extends BookingInterfaceCheckInOut {
    _id: string
}

export interface BookingInterfaceNoId extends BookingInterfaceCheckInOut {
    order_date: Date
    // check_in_date: Date
    // check_out_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id_list: string[]
    client_id: string
}

export interface BookingInterface extends BookingInterfaceNoId {
    _id: string
}