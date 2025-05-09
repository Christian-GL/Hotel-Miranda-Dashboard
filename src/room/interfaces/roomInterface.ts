
import { RoomType } from "../enums/roomType.ts"
import { RoomAmenities } from '../enums/roomAmenities.ts'
import { BookingInterface } from "../../booking/interfaces/bookingInterface.ts"


export interface RoomInterfaceNoId {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_id_list: string[]
}
export interface RoomInterface extends RoomInterfaceNoId {
    _id: string
}

export interface RoomInterfaceBookingsDataNoId {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_data_list: BookingInterface[]
}
export interface RoomInterfaceBookings extends RoomInterfaceBookingsDataNoId {
    _id: string
}