
import { BookingStatus } from '../data/bookingStatus.ts'


export interface BookingInterfaceWithOutID {
    photo: string
    full_name_guest: string
    order_date: string
    check_in_date: string
    check_out_date: string
    status: BookingStatus
    special_request: string
    room_list: number[]
}

export interface BookingInterface extends BookingInterfaceWithOutID {
    _id: string
}