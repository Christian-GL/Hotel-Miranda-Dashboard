
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
// export interface BookingInterfaceDataNoId {
//     order_date: Date
//     check_in_date: Date
//     check_out_date: Date
//     price: number
//     special_request: string
//     isArchived: OptionYesNo
//     room_data_list: RoomInterface[]
//     client_id: string
// }

// export interface BookingInterfaceData extends BookingInterfaceDataNoId {
//     _id: string
// }