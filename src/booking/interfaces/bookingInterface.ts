
import { OptionYesNo } from 'common/enums/optionYesNo'
import { RoomInterface } from '../../room/interfaces/roomInterface'


export interface BookingInterfaceNoId {
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id_list: string[]
    client_id: string
}

export interface BookingInterface extends BookingInterfaceNoId {
    _id: string
}

// !!! ACTUALIZAR:
// export interface BookingInterfaceBookingsDataNoId {
//     photo: string
//     full_name_guest: string
//     order_date: string
//     check_in_date: string
//     check_out_date: string
//     special_request: string
//     room_data: RoomInterface
// }

// export interface BookingInterfaceRoom extends BookingInterfaceBookingsDataNoId {
//     _id: string
// }