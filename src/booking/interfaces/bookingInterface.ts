
import { RoomInterface } from '../../room/interfaces/roomInterface.ts'
import { BookingStatus } from '../data/bookingStatus.ts'


export interface BookingInterfaceNoId {
    photo: string
    full_name_guest: string
    order_date: string
    check_in_date: string
    check_out_date: string
    status: BookingStatus
    special_request: string
    room_id: string
}

export interface BookingInterface extends BookingInterfaceNoId {
    _id: string
}

export interface BookingInterfaceBookingsDataNoId {
    photo: string
    full_name_guest: string
    order_date: string
    check_in_date: string
    check_out_date: string
    status: BookingStatus
    special_request: string
    room_data: RoomInterface
}

export interface BookingInterfaceRoom extends BookingInterfaceBookingsDataNoId {
    _id: string
}